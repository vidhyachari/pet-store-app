# scripts/ingest_kb.py
import os, re, chromadb
from chromadb.utils import embedding_functions

# Set the API key from environment variable if available
if "OPENAI_API_KEY" in os.environ and "CHROMA_OPENAI_API_KEY" not in os.environ:
    os.environ["CHROMA_OPENAI_API_KEY"] = os.environ["OPENAI_API_KEY"]

# If still not set, prompt user for API key
if "CHROMA_OPENAI_API_KEY" not in os.environ:
    api_key = input("Please enter your OpenAI API key: ").strip()
    os.environ["CHROMA_OPENAI_API_KEY"] = api_key

chroma = chromadb.PersistentClient(path="./.chroma")
emb = embedding_functions.OpenAIEmbeddingFunction(model_name="text-embedding-3-small")

col = chroma.get_or_create_collection(name="petstore_kb", embedding_function=emb)

def chunk(lines, source):
    buf, out = [], []
    for ln in lines:
        ln = ln.strip()
        if not ln: continue
        # start a new chunk on headings/bullets
        if ln.startswith(("#","-","•")) and buf:
            out.append((" ".join(buf), source))
            buf = [ln.lstrip("-• ").strip()]
        else:
            buf.append(ln)
    if buf: out.append((" ".join(buf), source))
    return out

def load(path, source):
    with open(path, "r", encoding="utf-8") as f:
        return [(txt, source) for txt, source in chunk(f.readlines(), source)]

docs = []
docs += load("docs/product_catalog.md", "products")
docs += load("docs/grooming_services.md", "grooming")
docs += load("docs/faq.md", "faq")
docs += load("docs/breed_info.md", "breeds")
docs += load("docs/feeding_guides.md", "feeding")
docs += load("docs/care_guides.md", "care")

ids   = []
texts = []
metas = []
for i,(txt,source) in enumerate(docs):
    ids.append(f"{source}_{i}")
    texts.append(txt)
    metas.append({"source": source})

# idempotent upsert
col.upsert(ids=ids, documents=texts, metadatas=metas)
print(f"Indexed {len(texts)} chunks into petstore_kb")
