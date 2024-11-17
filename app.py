from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import logging

app = FastAPI()

is_model = False

torch.set_printoptions(profile="full")
logging.basicConfig(level=logging.DEBUG)

MODEL_NAME = "Equall/Saul-7B-Instruct-v1"
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

tokenizer = None
model = None


@app.get("/health")
async def health():
    return {"status": "ok"}

# Root endpoint with HTML response
@app.get("/", response_class=HTMLResponse)
async def root():
    global tokenizer, model, is_model
    if is_model:
        try:
            tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
            model = AutoModelForCausalLM.from_pretrained(MODEL_NAME, torch_dtype=torch.float16).to(device)
            is_model = True
        except Exception as e:
            raise RuntimeError(f"Error loading model: {e}")

    print('The model has been loaded successfully!')

    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>App Status</title>
    </head>
    <body>
        <h1>Talion is Running</h1>
        <p>Welcome to the Saul-7B-Instruct API!</p>
        <p>Use the <code>/generate</code> endpoint to interact with the model.</p>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

@app.post("/generate/")
async def generate_text(prompt: str, max_length: int = 100):
    try:
        inputs = tokenizer(prompt, return_tensors="pt").to(device)
        outputs = model.generate(inputs.input_ids, max_length=max_length)
        response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        return {"generated_text": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
