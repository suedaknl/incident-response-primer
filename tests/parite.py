import json
from pathlib import Path

import numpy as np
import onnxruntime as ort

config = json.loads(Path("model/config.json").read_text(encoding="utf-8"))
oturum = ort.InferenceSession("model/model.onnx", providers=["CPUExecutionProvider"])

# Sıra: seviye, karar_suresi_sn, onceki_yanlis_sayisi
REFERANS_GIRDILER = [
    [1, 3.0, 0],
    [2, 8.5, 1],
    [3, 15.0, 2],
    [4, 25.0, 4],
    [5, 40.0, 7],
]

vakalar = []
for girdi in REFERANS_GIRDILER:
    x = np.array([girdi], dtype=np.float32)
    cikti = oturum.run([config["olasilik_cikti_adi"]], {config["girdi_adi"]: x})[0]
    p = cikti[0]  # [P(sınıf0), P(sınıf1)]
    vakalar.append({
        "girdi": dict(zip(config["ozellikler"], girdi)),
        "p0": float(p[0]),
        "p1": float(p[1]),   # ikinci sınıf = ipucu_gerekti=1
    })

Path("tests").mkdir(exist_ok=True)
Path("tests/parite.json").write_text(
    json.dumps(vakalar, indent=2, ensure_ascii=False), encoding="utf-8"
)
print("tests/parite.json yazıldı:", len(vakalar), "vaka")