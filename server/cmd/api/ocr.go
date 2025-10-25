package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
)

type FieldResult struct {
	Name	 string `json:"name"`
	Text 	 string `json:"text"`
	Confidence float64 `json:"confidence"`
}

type ExtractResponse struct {
	TemplateID string `json:"template_id"`
	Fields     []FieldResult `json:"fields"`
}

func forwardToOCR(ocrURL, templateID string, file multipart.File, fileName string) (*ExtractResponse, error) {
	var b bytes.Buffer
	writer := multipart.NewWriter(&b)

	// Add template_id field
	if err := writer.WriteField("template_id", templateID); err != nil {
		return nil, err
	}

	// Add file field
	part, err := writer.CreateFormFile("file", fileName)
	if err != nil {
		return nil, err
	}
	if _, err := io.Copy(part, file); err != nil {
		return nil, err
	}
	writer.Close()

	// Create HTTP request
	req, err := http.NewRequest("POST", ocrURL+"/process", &b)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("OCR service returned non-200 status: %s, body: %s", resp.Status, body)
	}

	var result ExtractResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	return &result, nil
}

func (app *application) ocrHandler(w http.ResponseWriter, r *http.Request) {
	ocrURL := os.Getenv("OCR_URL")
	if ocrURL == "" { ocrURL = "http://localhost:9000" }
	
	r.Body = http.MaxBytesReader(w, r.Body, 30<<20) // 30 MB limit
	if err := r.ParseMultipartForm(30 << 20); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	templateID := r.FormValue("template_id")
	if templateID == "" {
		app.badRequestResponse(w, r, fmt.Errorf("template_id is required"))
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		app.badRequestResponse(w, r, fmt.Errorf("file is required"))
		return
	}
	defer file.Close()

	result, err := forwardToOCR(ocrURL, templateID, file, header.Filename)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	app.writeJSON(w, http.StatusOK, envelope{"data": result}, nil)
}
