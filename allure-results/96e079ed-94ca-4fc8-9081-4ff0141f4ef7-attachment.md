# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: childWindows.spec.js >> Child Windows Handling
- Location: tests\childWindows.spec.js:3:1

# Error details

```
Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - link "Free Access to InterviewQues/ResumeAssistance/Material" [ref=e3] [cursor=pointer]:
      - /url: https://rahulshettyacademy.com/documents-request
    - link "Get Shortlisted by Recruiters - Take QA Skill Assessments on TechSmartHire" [ref=e4] [cursor=pointer]:
      - /url: https://techsmarthire.com/
  - generic [ref=e5]:
    - heading [level=3] [ref=e6]
    - generic [ref=e14]:
      - generic [ref=e15]:
        - generic [ref=e16]: "Username:"
        - textbox "Username:" [active] [ref=e17]: rahulshettyacademy.com
      - generic [ref=e18]:
        - generic [ref=e19]: "Password:"
        - textbox "Password:" [ref=e20]
      - generic [ref=e22]:
        - generic [ref=e23] [cursor=pointer]:
          - text: Admin
          - radio "Admin" [checked] [ref=e24]
        - generic [ref=e26] [cursor=pointer]:
          - text: User
          - radio "User" [ref=e27]
      - combobox [ref=e30]:
        - option "Student" [selected]
        - option "Teacher"
        - option "Consultant"
      - generic [ref=e31]:
        - generic [ref=e32]:
          - checkbox "I Agree to the terms and conditions" [ref=e34]
          - generic [ref=e35]:
            - text: I Agree to the
            - link "terms and conditions" [ref=e36] [cursor=pointer]:
              - /url: "#"
        - button "Sign In" [ref=e37] [cursor=pointer]
      - paragraph [ref=e39]:
        - text: (username is
        - generic [ref=e40]: rahulshettyacademy
        - text: and Password is
        - generic [ref=e41]: Learning@830$3mK2
        - text: )
```