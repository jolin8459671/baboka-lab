"""
批次把資料夾內所有 .webp 圖片轉成 .png
用法：
    python webp_to_png.py 輸入資料夾路徑 [輸出資料夾路徑]

範例：
    python webp_to_png.py C:\\Users\\jolin\\Desktop\\card_images
    python webp_to_png.py C:\\Users\\jolin\\Desktop\\card_images C:\\Users\\jolin\\Desktop\\card_images_png

如果不指定輸出資料夾，會在輸入資料夾旁邊自動建立一個「原資料夾名稱_png」的新資料夾，
原始 .webp 檔案不會被刪除或修改。
"""

import sys
from pathlib import Path
from PIL import Image


def convert_folder(input_dir: Path, output_dir: Path):
    output_dir.mkdir(parents=True, exist_ok=True)

    webp_files = list(input_dir.rglob("*.webp"))
    if not webp_files:
        print(f"在 {input_dir} 裡沒有找到任何 .webp 檔案")
        return

    print(f"找到 {len(webp_files)} 張 .webp 圖片，開始轉換...")

    success_count = 0
    fail_list = []

    for i, webp_path in enumerate(webp_files, start=1):
        # 保留子資料夾結構
        relative_path = webp_path.relative_to(input_dir)
        png_path = (output_dir / relative_path).with_suffix(".png")
        png_path.parent.mkdir(parents=True, exist_ok=True)

        try:
            with Image.open(webp_path) as img:
                # 轉成 RGBA 保留透明度（卡牌圖通常需要透明背景）
                img.convert("RGBA").save(png_path, "PNG")
            success_count += 1
            print(f"[{i}/{len(webp_files)}] 完成: {relative_path}")
        except Exception as e:
            fail_list.append((webp_path.name, str(e)))
            print(f"[{i}/{len(webp_files)}] 失敗: {relative_path} -> {e}")

    print("\n===== 轉換結果 =====")
    print(f"成功: {success_count} 張")
    print(f"失敗: {len(fail_list)} 張")
    if fail_list:
        for name, err in fail_list:
            print(f"  - {name}: {err}")
    print(f"輸出位置: {output_dir}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("請指定輸入資料夾路徑")
        print("用法: python webp_to_png.py 輸入資料夾路徑 [輸出資料夾路徑]")
        sys.exit(1)

    input_folder = Path(sys.argv[1])
    if not input_folder.exists():
        print(f"找不到資料夾: {input_folder}")
        sys.exit(1)

    if len(sys.argv) >= 3:
        output_folder = Path(sys.argv[2])
    else:
        output_folder = input_folder.parent / f"{input_folder.name}_png"

    convert_folder(input_folder, output_folder)
