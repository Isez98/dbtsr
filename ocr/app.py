import io, json, os, base64
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import cv2
from htr import align_to_canonical, deskew_and_binarize, crop, htr_read, postprocess
from snap_to_ink import snap_template_to_ink, snap_roi_to_ink

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

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
 try:
  print(f"Processing request with template_id: {template_id}, file: {file.filename}")
  
  tpath = os.path.join(TEMPLATES_DIR, f"{template_id}.json")
  if not os.path.exists(tpath):
   return JSONResponse({"error": "unknown template"}, status_code=400)

  cfg = json.load(open(tpath, "r", encoding="utf-8"))
  canon_path = os.path.join(TEMPLATES_DIR, os.path.basename(cfg["canonical_image"]))
  if not os.path.exists(canon_path):
   return JSONResponse({"error": "missing canonical image"}, status_code=500)

  # Load images
  print("Reading uploaded file...")
  data = await file.read()
  print(f"File size: {len(data)} bytes")
  
  file_bytes = np.frombuffer(data, dtype=np.uint8)
  img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
  if img is None:
   print("cv2.imdecode failed, trying PIL fallback...")
   # try PIL fallback
   pil = Image.open(io.BytesIO(data)).convert("RGB")
   img = cv2.cvtColor(np.array(pil), cv2.COLOR_RGB2BGR)
  
  print(f"Image loaded successfully, shape: {img.shape}")

  canonical = cv2.imread(canon_path, cv2.IMREAD_COLOR)
  if canonical is None:
   return JSONResponse({"error": "canonical not loadable"}, status_code=500)

  print("Starting alignment...")
  # Align
  aligned = align_to_canonical(img, canonical)
  print("Alignment completed")

  # Prepare gray for binarization
  gray = cv2.cvtColor(aligned, cv2.COLOR_BGR2GRAY)

  results = []
  for i, roi in enumerate(cfg["rois"]):
   print(f"Processing ROI {i+1}/{len(cfg['rois'])}: {roi['name']}")
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

  print("Processing completed successfully")
  return {
   "template_id": cfg["id"],
   "fields": results
  }
  
 except Exception as e:
  print(f"Error processing request: {str(e)}")
  import traceback
  traceback.print_exc()
  return JSONResponse({"error": str(e)}, status_code=500)

@app.post("/snap-to-ink")
async def snap_to_ink_endpoint(template_id: str = Form(...)):
  """Apply snap-to-ink auto-refinement to an existing template"""
  tpath = os.path.join(TEMPLATES_DIR, f"{template_id}.json")
  if not os.path.exists(tpath):
    return JSONResponse({"error": "unknown template"}, status_code=400)

  cfg = json.load(open(tpath, "r", encoding="utf-8"))
  canon_path = os.path.join(TEMPLATES_DIR, os.path.basename(cfg["canonical_image"]))
  if not os.path.exists(canon_path):
    return JSONResponse({"error": "missing canonical image"}, status_code=500)

  try:
    # Apply snap-to-ink refinement
    refined_template, preview_image = snap_template_to_ink(
      canon_path, cfg, preview_mode=True
    )
    
    # Create backup of original
    backup_path = tpath + '.backup'
    with open(backup_path, 'w') as f:
      json.dump(cfg, f, indent=2)
    
    # Save refined template
    with open(tpath, 'w') as f:
      json.dump(refined_template, f, indent=2)
    
    # Convert preview to base64
    _, buffer = cv2.imencode('.png', preview_image)
    preview_b64 = base64.b64encode(buffer).decode('utf-8')
    
    # Calculate changes summary
    changes = []
    for original, refined in zip(cfg["rois"], refined_template["rois"]):
      if (original['x'] != refined['x'] or original['y'] != refined['y'] or
          original['w'] != refined['w'] or original['h'] != refined['h']):
        changes.append({
          "name": original['name'],
          "original": {"x": original['x'], "y": original['y'], "w": original['w'], "h": original['h']},
          "refined": {"x": refined['x'], "y": refined['y'], "w": refined['w'], "h": refined['h']}
        })
    
    return {
      "template_id": cfg["id"],
      "backup_created": backup_path,
      "total_rois": len(cfg["rois"]),
      "rois_changed": len(changes),
      "changes": changes,
      "preview_image_b64": preview_b64
    }
    
  except Exception as e:
    return JSONResponse({"error": str(e)}, status_code=500)