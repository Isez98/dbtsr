#!/usr/bin/env python3
"""
Interactive ROI selector for OCR templates
Usage: python roi_selector.py path/to/canonical_image.png
"""

import cv2
import json
import sys
import os

class ROISelector:
    def __init__(self, image_path):
        self.image = cv2.imread(image_path)
        if self.image is None:
            raise ValueError(f"Could not load image: {image_path}")
        
        self.original_image = self.image.copy()
        self.rois = []
        self.current_roi = None
        self.drawing = False
        self.start_point = None
        
        # Scale image if too large
        self.scale_factor = 1.0
        height, width = self.image.shape[:2]
        max_height = 800
        if height > max_height:
            self.scale_factor = max_height / height
            new_width = int(width * self.scale_factor)
            new_height = int(height * self.scale_factor)
            self.display_image = cv2.resize(self.image, (new_width, new_height))
        else:
            self.display_image = self.image.copy()
        
        self.original_height, self.original_width = self.image.shape[:2]
        
    def mouse_callback(self, event, x, y, flags, param):
        if event == cv2.EVENT_LBUTTONDOWN:
            self.drawing = True
            self.start_point = (x, y)
            
        elif event == cv2.EVENT_MOUSEMOVE and self.drawing:
            # Show current rectangle
            temp_image = self.display_image.copy()
            cv2.rectangle(temp_image, self.start_point, (x, y), (0, 255, 0), 2)
            cv2.imshow('ROI Selector', temp_image)
            
        elif event == cv2.EVENT_LBUTTONUP:
            self.drawing = False
            if self.start_point:
                # Convert display coordinates to original image coordinates
                x1 = int(self.start_point[0] / self.scale_factor)
                y1 = int(self.start_point[1] / self.scale_factor)
                x2 = int(x / self.scale_factor)
                y2 = int(y / self.scale_factor)
                
                # Ensure proper rectangle bounds
                x_min, x_max = min(x1, x2), max(x1, x2)
                y_min, y_max = min(y1, y2), max(y1, y2)
                
                if x_max - x_min > 10 and y_max - y_min > 10:  # Minimum size
                    self.add_roi(x_min, y_min, x_max - x_min, y_max - y_min)
                
                self.start_point = None
                self.update_display()
    
    def add_roi(self, x, y, w, h):
        print(f"\n--- Adding new ROI ---")
        print(f"Coordinates: x={x}, y={y}, w={w}, h={h}")
        
        name = input("Enter ROI name: ").strip()
        if not name:
            print("Skipping ROI (no name provided)")
            return
            
        print("Available types: text, digits, currency, date")
        roi_type = input("Enter ROI type [text]: ").strip() or "text"
        
        roi = {
            "name": name,
            "x": x,
            "y": y,
            "w": w,
            "h": h,
            "type": roi_type
        }
        
        self.rois.append(roi)
        print(f"Added ROI: {roi}")
    
    def update_display(self):
        display = self.display_image.copy()
        
        # Draw all existing ROIs
        for i, roi in enumerate(self.rois):
            # Convert original coordinates to display coordinates
            x = int(roi['x'] * self.scale_factor)
            y = int(roi['y'] * self.scale_factor)
            w = int(roi['w'] * self.scale_factor)
            h = int(roi['h'] * self.scale_factor)
            
            # Draw rectangle
            cv2.rectangle(display, (x, y), (x + w, y + h), (0, 0, 255), 2)
            
            # Draw label
            label = f"{i+1}. {roi['name']} ({roi['type']})"
            cv2.putText(display, label, (x, y-10), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)
        
        cv2.imshow('ROI Selector', display)
    
    def remove_last_roi(self):
        if self.rois:
            removed = self.rois.pop()
            print(f"Removed ROI: {removed['name']}")
            self.update_display()
        else:
            print("No ROIs to remove")
    
    def save_template(self, template_id):
        template = {
            "id": template_id,
            "canvas_width": self.original_width,
            "canvas_height": self.original_height,
            "canonical_image": f"templates/canonical_{template_id}.png",
            "rois": self.rois
        }
        
        filename = f"{template_id}.json"
        with open(filename, 'w') as f:
            json.dump(template, f, indent=2)
        
        print(f"Template saved to {filename}")
        print("\nGenerated JSON:")
        print(json.dumps(template, indent=2))
    
    def run(self):
        cv2.namedWindow('ROI Selector', cv2.WINDOW_AUTOSIZE)
        cv2.setMouseCallback('ROI Selector', self.mouse_callback)
        
        self.update_display()
        
        print("=== ROI Selector ===")
        print("Instructions:")
        print("- Click and drag to create ROI rectangles")
        print("- Press 'u' to undo last ROI")
        print("- Press 's' to save template")
        print("- Press 'q' to quit")
        print("- Press 'r' to refresh display")
        
        while True:
            key = cv2.waitKey(1) & 0xFF
            
            if key == ord('q'):
                break
            elif key == ord('u'):
                self.remove_last_roi()
            elif key == ord('s'):
                template_id = input("\nEnter template ID: ").strip()
                if template_id:
                    self.save_template(template_id)
                else:
                    print("Template ID required")
            elif key == ord('r'):
                self.update_display()
        
        cv2.destroyAllWindows()

def main():
    if len(sys.argv) != 2:
        print("Usage: python roi_selector.py <image_path>")
        sys.exit(1)
    
    image_path = sys.argv[1]
    if not os.path.exists(image_path):
        print(f"Image file not found: {image_path}")
        sys.exit(1)
    
    try:
        selector = ROISelector(image_path)
        selector.run()
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()