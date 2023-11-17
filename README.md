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
  
## Clone a Repository

1. Open your terminal or command prompt.

2. Navigate to the directory where you want to clone the repository. You can use the `cd` command to change directories.

3. Clone the repository by running the following command:
   ```
   git clone https://github.com/xkaze09/dpsm-website.git
   ```
   
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
