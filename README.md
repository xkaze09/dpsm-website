# UPV Division of Physical Sciences and Mathematics Website

## Introduction

**Purpose:** The purpose of the website is to provide comprehensive information about UPV's Division of Physical Sciences and Mathematics (DPSM) department and its college courses.

**Target Audience:** Prospective and current students, faculty members, and other stakeholders interested in the department's offerings.

**Goals:**

- Showcase the range of courses offered by the department.
- Highlight faculty profiles and their areas of expertise.
- Provide information about the department's facilities and resources.
- Improve accessibility and user experience through responsive design.
- Allow visitors to easily contact the department for inquiries.

## General Requirements

The DPSM website will be developed adhering to the following guidelines:

- Built using HTML, CSS, and JavaScript.
- Implement responsive design using the Bootstrap framework to ensure optimal display on various devices.
- Ensure cross-browser compatibility to function well on major web browsers.

## Pages and Navigation

**Home Page:**

- Overview of the DPSM department, highlighting its mission and vision.
- Featured courses or news announcements.

## Project Setup

### Prerequisites

- Git installed on your computer. You can download and install Git from [git-scm.com](https://git-scm.com/downloads).
- Node. You can download from [nodejs.org](https://nodejs.org/en).
- Prettier Extension. Download from VSCode extensions.

## Clone a Repository

1. Open your terminal or command prompt.

2. Navigate to the directory where you want to clone the repository. You can use the `cd` command to change directories.

3. Clone the repository by running the following command:
   ```
   git clone https://github.com/xkaze09/dpsm-website.git
   ```

## Install dependencies

- `npm ci`. Run this command when you have a fresh copy of the repo in your local machine. This installs the necessary dependencies to run the project.

## Creating a New Branch

Follow these steps to create a new branch in your Git repository:

1. Open your terminal or command prompt.

2. Navigate to the root directory of your Git repository using the `cd` command.

3. Check the current branch you are using:
   ```
   git branch
   ```
4. Create a new branch using the git branch command. Replace <new-branch-name> with your desired branch name:
   ```
   git branch <new-branch-name>
   ```

### Note this naming convention

- feature/feature-name
- bugfix/issue-number
- enhancement/code-area
- release/version-number

#### For example:

```
git feature/resource-and-support
```

5. Start working on the newly created branch, use the git checkout command:
   ```
   git checkout <new-branch-name>
   ```
6. Alternatively, you can create and switch to a new branch in a single command:
   ```
   git checkout -b <new-branch-name>
   ```

## Committing and Pushing Changes

Now that you have cloned the repository, you can start making changes and committing them to your local Git history.

#### Important: Make sure to run the script "npm run compile:sass" in the background while making changes.

You can do this by:

1. Open Git Bash and navigate to the repository.
2. In the repository, execute:

```
npm run compile:sass
```

3. It should look like this:

   ![image](https://github.com/xkaze09/dpsm-website/assets/47445339/ca83dfbe-1a07-4496-81e0-a2bb6651afc2)

4. Now, you are ready to make changes. You can use Bootstrap5-ThemeKit.html to test if you loaded the repository properly.

#### Steps:

1. Create or edit files within the cloned repository according to your project's requirements. To see the status of your changes and files that have been modified, run:
   ```
   git status bash
   ```
2. Add the files you want to commit to the staging area using the git add command. For example:
   ```
   git add .
   ```
3. Commit your changes with a descriptive message:
   ```
   git commit -m "Insert commit message here"
   ```
4. Push your changes:
   ```
   git push -u <new-branch-name>
   ```

## Creating a Pull Request

1. Open your web browser and navigate to the repository's page on Github
2. Click the `Compare & Pull` button
3. Add your request message and comment to document changes.
4. Once done, just click the `Create pull request` button.
5. If PR is merged or closed, delete the branch.

## Guidelines for Data Handling and Navigation Components

### Data File Locations

Below are the main JSON data sources for dynamic content on the website. When working with or updating data, refer to these paths:

#### 1. Course Subjects Data
- **Path:** `javascript/course/data.json`
- **Purpose:** Contains the course subjects for three of the main course programs.
- **Usage:** Used to render course lists, program details, and subject information dynamically across the site.

#### 2. Research Projects Data
- **Path:** `javascript/research/researchData.json`
- **Purpose:** Stores details on research projects, publications, and related research activities.
- **Usage:** Populates research pages, faculty research listings, and research statistics.

**When modifying or adding data:**
- Always preserve the file’s existing structure and fields.
- Validate your JSON for correct syntax before committing.
- For new sections or categories, discuss with maintainers to ensure consistency.

---

### Editing Top and Bottom Navigation (Headers/Footers)

Navigation bars for both the university and division are modularized for consistency and maintainability.

**To modify navigation:**

1. **Edit the relevant files:**
    - **Top/University Navbar:**  
      - HTML: `header/university-navbar.html`  
      - JavaScript: `header/university-navbar.js` or related JS files.
    - **Division Navbar:**  
      - HTML: `header/division-navbar.html`  
      - JavaScript: `header/division-navbar.js` or related JS files.
    - **Footer:**  
      - HTML: `header/footer.html`  
      - JavaScript: `header/footer.js` or related JS files.

2. **Apply changes across all pages:**  
   After making changes to any header or footer files, run the following command:
   ```
   python components.py
   ```
   This ensures that all HTML files in the project are automatically updated with the latest navigation and footer components.

3. **Test your changes:**  
   - Open various pages to confirm that navigation and footer elements are displaying and functioning correctly (especially on both mobile and desktop).
   - Check for consistent appearance and links.

4. **Best Practices:**  
   - **Do not** manually duplicate navigation code in multiple HTML files. Always use the component system and the `components.py` script.
   - For major navigation changes, open a pull request with a clear description of the modifications and their impact for review by other maintainers.
   - Ensure all navigation labels, links, and dropdowns remain accessible and up-to-date.

---

### Handling News Articles in `/articles` Folder

#### Current Situation (Static Handling)

- News articles are currently stored as static HTML files in the `/articles` directory.
- To add or update news articles:
  1. Duplicate an existing HTML file in the `/articles` folder.
  2. Edit the new file’s content to reflect your article.
  3. Always run `npm run compile:sass` in the background before you start coding to ensure your styles compile correctly.
  4. Frequently save your work (`Ctrl+S`).
  5. When finished, commit your changes to your branch and open a pull request.
  6. Use the Vercel and Netlify bot staging URLs in the PR comments to preview your changes.
  7. Tag @xkaze09 for review and final check.

#### Ongoing Update (Dynamic Handling In Progress)

- An update is underway (see the latest pull request) to establish a database-backed system for news articles, enabling easy CRUD operations for the division.
- In the future, news articles will be managed dynamically (e.g., via Supabase or another backend), but for now, follow the static procedure above.

---

Maintain consistency, validate your data and code, and always follow the PR and review workflow for changes to data, navigation, and news articles.
---
