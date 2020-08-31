# TypeScipt Template Repository

> Bootstrap your next TypeScipt project by using this [GitHub Template](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-template-repository) repository

This project comes with the following tools:

- TypeScript
- Code Quality
  - [x] ESLint
  - [x] [TSDocs](https://api-extractor.com/)
  - [x] Jest (TDD)
  - [x] GitHub Issue/PR Templates (PR only)
  - [ ] README templates
- Code Velocity
  - [x] GitHub Actions (CI/CD) (CI only)
  - [ ] CodeClimate (CI)
  - [x] [commitlint](https://github.com/conventional-changelog/commitlint) (using [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)) (CI)
  - [ ] Semantic Release (CD)

## Usage

### Install (New Repository)

To use this template for a new repository, click on the green button above that says "Use this template".

Complete the following todo list:

1. [  ] create [personal access token](https://github.com/settings/tokens) (with `repo` scope) and provide as `GH_TOKEN` secret.

### Install (Existing Repository)

If you want to apply the files/structure to an already existing repository, follow the steps in the `Update` section below.

### Update

To merge any advances that the template makes into your project:

```
git remote add template git@github.com:MichaelHirn/ts-template.git
git fetch --all
git merge template/master --allow-unrelated-histories --squash
```
