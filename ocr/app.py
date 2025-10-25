import io, json, os, base64
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.responses import JSONResponse
from PIL import Image
import numpy as np
import cv2
from htr import align_to_canonical, deskew_and_binarize, crop, htr_read, postprocess

app = FastAPI()

TEMPLATES_DIR = os.path.join(os.getcwd(), "templates")

@app.get("/health")
async def health():
  return {"ok": True}

@app.post("/debug-rois")
async def debug_rois(template_id: str = Form(...), file: UploadFile = File(...)):
  """Debug endpoint to visualize ROI extractions without OCR processing"""
  tpath = os.path.join(TEMPLATES_DIR, f"{template_id}.json")
  if not os.path.exists(tpath):
    return JSONResponse({"error": "unknown template"}, status_code=400)

  cfg = json.load(open(tpath, "r", encoding="utf-8"))
  canon_path = os.path.join(TEMPLATES_DIR, os.path.basename(cfg["canonical_image"]))
  if not os.path.exists(canon_path):
    return JSONResponse({"error": "missing canonical image"}, status_code=500)

  # Load and process image
  data = await file.read()
  file_bytes = np.frombuffer(data, dtype=np.uint8)
  img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
  if img is None:
    pil = Image.open(io.BytesIO(data)).convert("RGB")
    img = cv2.cvtColor(np.array(pil), cv2.COLOR_RGB2BGR)

  canonical = cv2.imread(canon_path, cv2.IMREAD_COLOR)
  if canonical is None:
    return JSONResponse({"error": "canonical not loadable"}, status_code=500)

  # Align image
  aligned = align_to_canonical(img, canonical)
  gray = cv2.cvtColor(aligned, cv2.COLOR_BGR2GRAY)

  results = []
  for roi in cfg["rois"]:
    x, y, w, h = roi["x"], roi["y"], roi["w"], roi["h"]
    patch = crop(gray, x, y, w, h)
    
    # Convert patch to base64 for visualization
    _, buffer = cv2.imencode('.png', patch)
    patch_b64 = base64.b64encode(buffer).decode('utf-8')
    
    results.append({
      "name": roi["name"],
      "type": roi["type"],
      "coordinates": {"x": x, "y": y, "w": w, "h": h},
      "patch_size": {"height": patch.shape[0], "width": patch.shape[1]},
      "patch_image_b64": patch_b64
    })

  return {
    "template_id": cfg["id"],
    "canvas_size": {"width": cfg["canvas_width"], "height": cfg["canvas_height"]},
    "aligned_image_size": {"height": gray.shape[0], "width": gray.shape[1]},
    "rois": results
  }

@app.post("/process")
async def process(template_id: str = Form(...), file: UploadFile = File(...)):
 tpath = os.path.join(TEMPLATES_DIR, f"{template_id}.json")
 if not os.path.exists(tpath):
  return JSONResponse({"error": "unknown template"}, status_code=400)

 cfg = json.load(open(tpath, "r", encoding="utf-8"))
 canon_path = os.path.join(TEMPLATES_DIR, os.path.basename(cfg["canonical_image"]))
 if not os.path.exists(canon_path):
  return JSONResponse({"error": "missing canonical image"}, status_code=500)

 # Load images
 data = await file.read()
 file_bytes = np.frombuffer(data, dtype=np.uint8)
 img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
 if img is None:
  # try PIL fallback
  pil = Image.open(io.BytesIO(data)).convert("RGB")
  img = cv2.cvtColor(np.array(pil), cv2.COLOR_RGB2BGR)

 canonical = cv2.imread(canon_path, cv2.IMREAD_COLOR)
 if canonical is None:
  return JSONResponse({"error": "canonical not loadable"}, status_code=500)

 # Align
 aligned = align_to_canonical(img, canonical)

 # Prepare gray for binarization
 gray = cv2.cvtColor(aligned, cv2.COLOR_BGR2GRAY)

 results = []
 for i, roi in enumerate(cfg["rois"]):
  x, y, w, h = roi["x"], roi["y"], roi["w"], roi["h"]
  ftype = roi.get("type", "text")
  patch = crop(gray, x, y, w, h)
  
  # Skip patches that are too small for TrOCR processing
  if patch.shape[0] < 10 or patch.shape[1] < 10:
    results.append({
     "name": roi["name"],
     "text": "",
     "confidence": 0.0
    })
    continue
    
  binimg = deskew_and_binarize(patch)
  # Convert grayscale to RGB for TrOCR processor
  rgb_img = cv2.cvtColor(binimg, cv2.COLOR_GRAY2RGB)
  pil = Image.fromarray(rgb_img)
  text, conf = htr_read(pil, ftype)  # Pass field type for better processing
  text = postprocess(text, ftype)
  results.append({
   "name": roi["name"],
   "text": text,
   "confidence": round(float(conf), 3)
  })


 return {
  "template_id": cfg["id"],
  "fields": results
 }