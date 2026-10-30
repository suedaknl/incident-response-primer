import json
from pathlib import Path

import numpy as np
import pandas as pd
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

SEED = 42
ESIK = 0.70
OZELLIKLER = ["seviye", "karar_suresi_sn", "onceki_yanlis_sayisi"]
HEDEF = "ipucu_gerekti"
VERI_YOLU = Path("data/oturumlar.csv")
MODEL_DIR = Path("model")


def main():
    df = pd.read_csv(VERI_YOLU)
    eksik = [c for c in OZELLIKLER + [HEDEF] if c not in df.columns]
    if eksik:
        raise ValueError(f"CSV'de eksik sütunlar: {eksik}")
    df = df.dropna(subset=OZELLIKLER + [HEDEF])

    X = df[OZELLIKLER].to_numpy(dtype=np.float32)
    y = df[HEDEF].to_numpy(dtype=np.int64)

    X_egitim, X_test, y_egitim, y_test = train_test_split(
        X, y, test_size=0.2, random_state=SEED, stratify=y
    )

    model = Pipeline([
        ("olcekle", StandardScaler()),
        ("lojistik", LogisticRegression(random_state=SEED, max_iter=1000)),
    ])
    model.fit(X_egitim, y_egitim)

    acc = accuracy_score(y_test, model.predict(X_test))
    print(f"Accuracy: {acc:.4f} (eşik: {ESIK})")

    if acc < ESIK:
        raise Exception(
            f"Model eşiği geçemedi: accuracy={acc:.4f} < {ESIK}. Dışa aktarma yapılmadı."
        )

    MODEL_DIR.mkdir(exist_ok=True)
    onnx_model = convert_sklearn(
        model,
        initial_types=[("input", FloatTensorType([None, len(OZELLIKLER)]))],
        options={LogisticRegression: {"zipmap": False}},  # olasılıklar düz tensör olsun
        target_opset=15,
    )
    (MODEL_DIR / "model.onnx").write_bytes(onnx_model.SerializeToString())

    config = {
        "girdi_adi": "input",
        "ozellikler": OZELLIKLER,          # SIRA önemli
        "hedef": HEDEF,
        "siniflar": [int(c) for c in model.classes_],
        "olasilik_cikti_adi": "probabilities",
        "esik": ESIK,
        "accuracy": round(float(acc), 4),
        "random_state": SEED,
    }
    (MODEL_DIR / "config.json").write_text(
        json.dumps(config, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    print("Kaydedildi: model/model.onnx, model/config.json")


if __name__ == "__main__":
    main()