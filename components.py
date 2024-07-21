import os

for root, dirnames, filenames in os.walk("."):
    for filename in filenames:
        if "Bootstrap5-ThemeKit" not in filename and filename.endswith(".html"):
            fname = os.path.join(root, filename)
            print(f"Editing {fname}")

            file_content = ""
            should_write = True
            has_header_script = False
            has_footer_script = False
            has_university_navbar = False
            has_division_navbar = False
            has_dpsm_footer = False

            try:
                with open(fname, encoding="utf-8") as html:
                    lines = html.readlines()

                    # Check existing elements and scripts
                    for line in lines:
                        if '<script src="/components/header/university-navbar.js" defer></script>' in line:
                            has_header_script = True
                        if '<script src="/components/header/division-navbar.js" defer></script>' in line:
                            has_header_script = True
                        if '<script src="/components/footer.js" defer></script>' in line:
                            has_footer_script = True
                        if "<university-navbar>" in line:
                            has_university_navbar = True
                        if "<division-navbar>" in line:
                            has_division_navbar = True
                        if "<dpsm-footer>" in line:
                            has_dpsm_footer = True

                    # Rebuild the file content with necessary modifications
                    for line in lines:
                        # Add the header script if not already present
                        if not has_header_script and "</head>" in line:
                            file_content += """<script src="/components/header/university-navbar.js" defer></script>
                            <script src="/components/header/division-navbar.js" defer></script>
                            <script src="/components/footer.js" defer></script>\n"""
                            has_header_script = True

                        # Check for university navbar section
                        if "<!-- University Navbar Section -->" in line:
                            file_content += line
                            should_write = False
                        elif "<!-- End of University Navbar -->" in line:
                            if not has_university_navbar:
                                file_content += "<university-navbar></university-navbar>\n"
                            should_write = True

                        # Check for division navbar section
                        if "<!-- Division Navbar Section -->" in line:
                            file_content += line
                            should_write = False
                        elif "<!-- End of Division Navbar -->" in line:
                            if not has_division_navbar:
                                file_content += "<division-navbar></division-navbar>\n"
                            should_write = True

                        # Check for footer section
                        if "<!-- Footer -->" in line:
                            file_content += line
                            should_write = False
                        elif "<!-- End of Footer -->" in line:
                            if not has_dpsm_footer:
                                file_content += "<dpsm-footer></dpsm-footer>\n"
                            should_write = True

                        # Append line if not within a replace section
                        if should_write:
                            file_content += line

                # Write the updated content back to the file
                with open(fname, "w", encoding="utf-8") as html:
                    html.write(file_content)

            except Exception as e:
                print(fname, e)
