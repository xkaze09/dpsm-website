import os

def remove_duplicates_and_inject(fname):
    try:
        with open(fname, encoding="utf-8") as file:
            lines = file.readlines()

        output = []
        inside_section = None

        for line in lines:
            line_lower = line.lower()

            # Skip fontawesome.css
            if "fontawesome.css" in line_lower:
                continue

            # Skip previously injected scripts
            if "university-navbar.js" in line_lower or \
               "division-navbar.js" in line_lower or \
               "footer.js" in line_lower:
                continue

            # Strip any floating <university-navbar>, <division-navbar>, <dpsm-footer>
            if "<university-navbar" in line_lower or "</university-navbar" in line_lower:
                continue
            if "<division-navbar" in line_lower or "</division-navbar" in line_lower:
                continue
            if "<dpsm-footer" in line_lower or "</dpsm-footer" in line_lower:
                continue

            # Clear block content between injected comment markers
            if "<!-- university navbar section -->" in line_lower:
                inside_section = "univ"
                output.append(line)
                output.append("<university-navbar></university-navbar>\n")
                continue
            elif "<!-- end of university navbar -->" in line_lower:
                inside_section = None
                output.append(line)
                continue
            elif "<!-- division navbar section -->" in line_lower:
                inside_section = "div"
                output.append(line)
                output.append("<division-navbar></division-navbar>\n")
                continue
            elif "<!-- end of division navbar -->" in line_lower:
                inside_section = None
                output.append(line)
                continue
            elif "<!-- footer -->" in line_lower:
                inside_section = "footer"
                output.append(line)
                output.append("<dpsm-footer></dpsm-footer>\n")
                continue
            elif "<!-- end of footer -->" in line_lower:
                inside_section = None
                output.append(line)
                continue

            if inside_section:
                continue  # Skip anything between markers

            # Inject script block before </head>
            if "</head>" in line_lower:
                output.append("""<script src="/components/header/university-navbar.js" defer></script>
<script src="/components/header/division-navbar.js" defer></script>
<script src="/components/footer.js" defer></script>\n""")

            output.append(line)

        with open(fname, "w", encoding="utf-8") as file:
            file.writelines(output)

    except Exception as e:
        print(f"❌ Error processing {fname}: {e}")

# Main walker
for root, _, files in os.walk("."):
    for filename in files:
        if filename.endswith(".html") and "Bootstrap5-ThemeKit" not in filename:
            full_path = os.path.join(root, filename)
            print(f"🧼 Cleaning {full_path}")
            remove_duplicates_and_inject(full_path)
