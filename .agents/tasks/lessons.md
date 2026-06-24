# Lessons

- When a requested feature overlaps strongly with a mature dedicated tool, challenge whether the local app should launch/reference that tool instead of reimplementing it. This prevents unnecessary engine complexity and keeps the personal toolbox lean.
- Generator tools should start with empty user-editable content. Put examples behind an explicit Sample action so users do not have to clear placeholders before entering real values.
- When a compact selector uses technical IDs, keep the ID visible and include the explanation in the UI. Do not replace needed descriptions with labels alone.
- For QR/barcode work, verify both the encoded symbol data and decoded scanner result metadata before declaring format/type behavior correct. Do not infer scanner behavior from the generation API alone.
