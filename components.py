import os


for root, dirnames, filenames in os.walk("."):
    for filename in filenames:
        if "Bootstrap5-ThemeKit" not in filename and filename.endswith(".html"):
            fname = os.path.join(root, filename)
            print(f"Editing {fname}")

            file_content = ""
            should_write = True

            try:
                with open(fname, encoding="utf-8") as html:
                    line = html.readline()

                    while line:
                        if "</head>" in line:
                            file_content += """<script src="/components/header/university-navbar.js" defer></script>
                            <script src="/components/header/division-navbar.js" defer></script>
                            <script src="/components/footer.js" defer></script>\n"""

                        # Replaces the navbar section with the component
                        if "<!-- University Navbar Section -->" in line:
                            # include the comment first
                            file_content += line
                            should_write = False
                        elif "<!-- End of University Navbar -->" in line:
                            file_content += "<university-navbar></university-navbar>\n"
                            should_write = True

                        # Replaces the navbar section with the component
                        if "<!-- Division Navbar Section -->" in line:
                            # include the comment first
                            file_content += line
                            should_write = False
                        elif "<!-- End of Division Navbar -->" in line:
                            file_content += "<division-navbar></division-navbar>\n"
                            should_write = True

                        # Replaces the footer section with the component
                        if "<!-- Footer -->" in line:
                            # include the comment first
                            file_content += line
                            should_write = False
                        elif "<!-- End of Footer -->" in line:
                            file_content += "<dpsm-footer></dpsm-footer>\n"
                            should_write = True

                        # should_write should be true for lines that are not between the navbar or footer
                        if should_write:
                            file_content += line

                        line = html.readline()

                with open(fname, "w", encoding="utf-8") as html:
                    html.write(file_content)

            except Exception as e:
                print(fname, e)