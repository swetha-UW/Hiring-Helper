# Hiring-Helper
# Gmail to S3 Resume Automation

This automation helps recruiters automatically collect resumes from LinkedIn candidates who respond via email. It scans your Gmail inbox for candidate emails with a LinkedIn profile link in the subject, saves the resume attachments and cover letter (email body), and uploads them to an AWS S3 bucket.

---

## 📩 Candidate Workflow

Here’s the **LinkedIn message** you can set as auto-reply to the candidates who respond to your hiring posts on LinkedIn:

> “Hi [Candidate Name],  
> Please send me an email with your resume attached and your cover letter in the email body.  
> Use this format for your email subject:  
>  
> **`<LinkedIn Profile URL>`**   
>  
> This will help us automatically organize your application.”

---

## 🧰 How It Works

1. Gmail searches for **unread emails** with LinkedIn URLs in the subject line.  
2. It extracts:
   - Candidate name and LinkedIn profile  
   - Email body (cover letter)
   - Attachments (resume files)
3. Converts attachments to Base64 and sends them via a webhook (your AWS endpoint) for upload to S3.

---

## ☁️ Setup Instructions
---
### 1. Create a Free AWS Account
- Go to [https://aws.amazon.com/free](https://aws.amazon.com/free)
- Set up your account using an email address and credit card (required for verification)
- Log in to the **AWS Management Console**
- Go to **Billing → Budgets → Create budget**
- Set a budget limit (e.g., $0.01/month) to avoid unexpected charges.
---
### 2. Create an S3 Bucket
- In the AWS Console, go to **S3 → Create bucket**
- Name your bucket something like: `<your_name>-hiring`
- Leave the defaults except:
  - **Block all public access:** ✅ (keep this enabled)
- Click **Create bucket**
- Use AWS Lambda + API Gateway to create a simple HTTP endpoint that writes incoming data to your S3 bucket.
---
### 3. Getting your AWS webhook
- Open AWS Lambda Console: https://console.aws.amazon.com/lambda.
- Click on the Lambda function you created (for example, process-resumes).
- Go to Configuration in the left sidebar → Choose Function URL from the list.
- Create a Function URL (if not already created)
- For Auth type, select NONE (you can switch to secured mode later).
- Click Save.
- Copy the URL
- After saving, you’ll see a link that looks like this: https://<xyz-abc-123>.lambda-url.us-east-1.on.aws/
> This URL will be your `WEBHOOK_URL` in the App Script code.
---
### 4. Deploy the Google App Script
1. Go to [Google Apps Script](https://script.google.com/)
2. Click **New Project**
3. Name it `Hiring Helper Gmail to S3`
4. Replace the sample code with the code in 'gmail_to_s3.js' file
5. Save and **Deploy → New Deployment → Web App**
6. Choose:
   - **Execute as:** Me  
   - **Who has access:** Anyone with the link
     
   This grants the script permission to access Gmail.
7. Follow these steps to schedule the script to check Gmail every minute.
   - Go to Triggers → Add Trigger:
   - Function: processLinkedInEmails
   - Event source: Time-driven
   - Select schedule (e.g., every 1 minute)



