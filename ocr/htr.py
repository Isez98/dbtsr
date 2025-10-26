from typing import Tuple
import numpy as np
import cv2
from PIL import Image, ImageEnhance, ImageFilter
import unicodedata
import torch

from transformers import TrOCRProcessor, VisionEncoderDecoderModel


# Lazy singletons
_processor = None
_model = None
_large_processor = None
_large_model = None


def get_device():
  """Use GPU if available (ROCm for AMD), fallback to CPU"""
  if torch.cuda.is_available():
    device = torch.device("cuda")
    gpu_name = torch.cuda.get_device_name(0) if torch.cuda.is_available() else "Unknown"
    print(f"Using GPU: {gpu_name}")
    return device
  else:
    device = torch.device("cpu")
    print("Using CPU (GPU not available)")
    return device


def get_model(use_large=False):
  global _processor, _model, _large_processor, _large_model
  device = get_device()
  
  if use_large:
    if _large_processor is None:
      _large_processor = TrOCRProcessor.from_pretrained("microsoft/trocr-large-handwritten")
    if _large_model is None:
      _large_model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-large-handwritten")
      if device.type == "cuda":
        _large_model = _large_model.to(device)
      _large_model.eval()
      # Enable memory efficient attention if available
      if hasattr(_large_model.config, 'use_cache'):
        _large_model.config.use_cache = False
    return _large_processor, _large_model
  else:
    if _processor is None:
      _processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-handwritten")
    if _model is None:
      _model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-handwritten")
      if device.type == "cuda":
        _model = _model.to(device)
      _model.eval()
      # Enable memory efficient attention if available
      if hasattr(_model.config, 'use_cache'):
        _model.config.use_cache = False
    return _processor, _model




def enhance_image_for_htr(pil_img: Image.Image) -> Image.Image:
  """Enhanced preprocessing specifically for handwriting recognition"""
  
  # Convert to grayscale if needed
  if pil_img.mode != 'L':
    pil_img = pil_img.convert('L')
  
  # Enhance contrast
  enhancer = ImageEnhance.Contrast(pil_img)
  pil_img = enhancer.enhance(1.5)
  
  # Enhance sharpness
  enhancer = ImageEnhance.Sharpness(pil_img)
  pil_img = enhancer.enhance(1.2)
  
  # Apply slight gaussian blur to reduce noise
  pil_img = pil_img.filter(ImageFilter.GaussianBlur(radius=0.5))
  
  # Convert to numpy for OpenCV operations
  img_array = np.array(pil_img)
  
  # Adaptive histogram equalization (CLAHE)
  clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
  img_array = clahe.apply(img_array)
  
  # Advanced denoising
  img_array = cv2.fastNlMeansDenoising(img_array, h=10, templateWindowSize=7, searchWindowSize=21)
  
  # Improved binarization using Otsu's method with Gaussian blur
  blur = cv2.GaussianBlur(img_array, (5,5), 0)
  _, binary = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
  
  # Morphological operations to clean up the image
  kernel = np.ones((2,2), np.uint8)
  binary = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)
  binary = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel)
  
  # Convert back to PIL and ensure RGB for TrOCR
  enhanced_pil = Image.fromarray(binary).convert('RGB')
  
  return enhanced_pil


def deskew_and_binarize(gray: np.ndarray) -> np.ndarray:
  # Light clean-up: median blur + adaptive threshold
  blur = cv2.medianBlur(gray, 3)
  th = cv2.adaptiveThreshold(blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                            cv2.THRESH_BINARY, 31, 15)
  return th




def align_to_canonical(img: np.ndarray, canonical: np.ndarray) -> np.ndarray:
  # ORB keypoints + homography
  orb = cv2.ORB_create(1500)
  kp1, des1 = orb.detectAndCompute(img, None)
  kp2, des2 = orb.detectAndCompute(canonical, None)
  if des1 is None or des2 is None:
    return img
  bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
  matches = bf.match(des1, des2)
  if len(matches) < 10:
    return img
  matches = sorted(matches, key=lambda x: x.distance)[:200]
  src_pts = np.float32([kp1[m.queryIdx].pt for m in matches]).reshape(-1,1,2)
  dst_pts = np.float32([kp2[m.trainIdx].pt for m in matches]).reshape(-1,1,2)
  H, _ = cv2.findHomography(src_pts, dst_pts, cv2.RANSAC, 5.0)
  if H is None:
    return img
  h, w = canonical.shape[:2]
  warped = cv2.warpPerspective(img, H, (w, h))
  return warped




def crop(img: np.ndarray, x: int, y: int, w: int, h: int) -> np.ndarray:
  h_img, w_img = img.shape[:2]
  x = max(0, min(x, w_img-1))
  y = max(0, min(y, h_img-1))
  w = max(1, min(w, w_img - x))
  h = max(1, min(h, h_img - y))
  return img[y:y+h, x:x+w]




def htr_read(pil_img: Image.Image, field_type: str = "text") -> Tuple[str, float]:
  """Hybrid HTR: GPU for model inference, CPU for image processing"""
  
  # Basic image preprocessing (CPU only to avoid ROCm conflicts)
  if pil_img.mode != 'RGB':
    pil_img = pil_img.convert('RGB')
  
  # Get model and processor
  processor, model = get_model(use_large=False)
  
  try:
    # Process image on CPU (preprocessor handles this)
    pixel_values = processor(images=pil_img, return_tensors="pt").pixel_values
    
    # Move to GPU only for model inference if available
    device = next(model.parameters()).device
    if device.type == "cuda":
      pixel_values = pixel_values.to(device)
    
    with torch.no_grad():
      # Generate with beam search for better results
      generated_ids = model.generate(
        pixel_values,
        max_length=50,
        num_beams=3,
        early_stopping=True,
        do_sample=False
      )
      
    text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0].strip()
    
    # Calculate basic confidence based on text characteristics
    confidence = calculate_confidence(text, field_type, pil_img.size)
    
    return text, confidence
    
  except Exception as e:
    print(f"HTR processing error: {e}")
    return "", 0.0


def calculate_confidence(text: str, field_type: str, image_size: tuple) -> float:
  """Calculate confidence score based on text characteristics and field type"""
  if not text:
    return 0.0
  
  base_confidence = 0.3  # Start with base confidence
  
  # Length-based confidence
  expected_lengths = {
    "digits": (1, 3),
    "currency": (3, 10),
    "date": (8, 12),
    "text": (2, 50)
  }
  
  min_len, max_len = expected_lengths.get(field_type, (1, 50))
  if min_len <= len(text) <= max_len:
    base_confidence += 0.2
  
  # Character pattern matching
  if field_type == "digits":
    if text.replace(" ", "").isdigit():
      base_confidence += 0.3
  elif field_type == "currency":
    import re
    if re.match(r'^\d+\.?\d*$', text.replace(" ", "").replace(",", "")):
      base_confidence += 0.3
  elif field_type == "date":
    import re
    if re.search(r'\d{1,4}[/\-\.]\d{1,2}[/\-\.]\d{1,4}|\d{4}-\d{2}-\d{2}', text):
      base_confidence += 0.3
  
  # Penalize special characters in simple fields
  if field_type in ["digits", "currency"]:
    special_chars = sum(1 for c in text if not c.isalnum() and c not in ".,/-$ ")
    base_confidence -= min(0.2, special_chars * 0.05)
  
  # Image size factor (larger patches generally yield better results)
  width, height = image_size
  if width > 100 and height > 30:
    base_confidence += 0.1
  
  return min(1.0, max(0.0, base_confidence))




def postprocess(text: str, ftype: str) -> str:
  """Enhanced postprocessing with better field-specific cleaning"""
  # Basic normalization
  text = unicodedata.normalize("NFC", text)
  text = text.strip()
  
  if ftype == "digits":
    import re
    # Extract only digits and basic formatting
    text = re.sub(r"[^0-9+\-\s]", "", text)
    # Remove extra spaces
    text = re.sub(r'\s+', ' ', text).strip()
    # If it's just a number, clean it up
    numbers = re.findall(r'\d+', text)
    if numbers:
      text = numbers[0]  # Take the first number found
      
  elif ftype == "currency":
    import re
    # More sophisticated currency processing
    # First, try to extract number patterns
    text = text.replace('$', '').replace('€', '').replace('£', '')
    
    # Handle common OCR mistakes
    text = text.replace('O', '0').replace('o', '0').replace('l', '1').replace('I', '1')
    
    # Extract digits, dots, and commas
    cleaned = re.sub(r"[^0-9.,]", "", text)
    
    # Handle different decimal formats
    if ',' in cleaned and '.' in cleaned:
      # Determine which is decimal separator
      comma_pos = cleaned.rfind(',')
      dot_pos = cleaned.rfind('.')
      if dot_pos > comma_pos:
        # Dot is decimal separator, comma is thousands
        cleaned = cleaned.replace(',', '')
      else:
        # Comma is decimal separator, dot is thousands
        cleaned = cleaned.replace('.', '').replace(',', '.')
    elif ',' in cleaned:
      # Could be thousands or decimal separator
      parts = cleaned.split(',')
      if len(parts) == 2 and len(parts[1]) <= 2:
        # Likely decimal separator
        cleaned = cleaned.replace(',', '.')
      else:
        # Likely thousands separator
        cleaned = cleaned.replace(',', '')
    
    try:
      v = float(cleaned)
      text = f"{v:.2f}"
    except (ValueError, TypeError):
      text = cleaned
      
  elif ftype == "date":
    import re
    # Enhanced date processing
    text = text.replace(" ", "").replace(".", "/").replace("-", "/")
    
    # Handle common OCR mistakes in dates
    text = text.replace('O', '0').replace('o', '0').replace('l', '1').replace('I', '1')
    
    # Extract all numbers
    numbers = re.findall(r"(\d{1,4})", text)
    if len(numbers) >= 3:
      a, b, c = numbers[0], numbers[1], numbers[2]
      try:
        # Convert to integers to validate
        day, month, year = int(a), int(b), int(c)
        
        # Determine format based on number sizes
        if len(c) == 4:  # DD/MM/YYYY
          if 1 <= day <= 31 and 1 <= month <= 12:
            text = f"{c}-{month:02d}-{day:02d}"
        elif len(a) == 4:  # YYYY/MM/DD
          if 1 <= month <= 12 and 1 <= day <= 31:
            text = f"{a}-{month:02d}-{day:02d}"
        else:  # Assume DD/MM/YY and convert to 20YY
          if year < 50:
            year += 2000
          elif year < 100:
            year += 1900
          if 1 <= day <= 31 and 1 <= month <= 12:
            text = f"{year}-{month:02d}-{day:02d}"
      except (ValueError, TypeError):
        pass
        
  elif ftype == "text":
    # Clean up common OCR artifacts in text
    import re
    # Remove excessive whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    # Remove standalone special characters that are likely OCR errors
    text = re.sub(r'\s[^\w\s]\s', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
  
  return text