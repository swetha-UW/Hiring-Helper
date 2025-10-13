function processLinkedInEmails() {
  const WEBHOOK_URL = "<insert_your_webhook_URL_here>";
  const LINKEDIN_REGEX = /https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9\-]+\/?/;
  
  const threads = GmailApp.search('is:unread subject:"linkedin.com/in/"');
  
  if (threads.length === 0) {
    Logger.log("No matching threads.");
    return;
  }

  for (const thread of threads) {
    const messages = thread.getMessages();

    for (const msg of messages) {
      if (!msg.isUnread()) continue;

      const subject = msg.getSubject();
      const match = subject.match(LINKEDIN_REGEX);
      if (!match) {
        Logger.log("No LinkedIn URL in subject: %s", subject);
        continue;
      }

      const linkedinUrl = match[0];
      const body = msg.getPlainBody();
      const sender = msg.getFrom();

      const attachments = msg.getAttachments();
      const files = attachments.map(file => ({
        filename: file.getName(),
        content: Utilities.base64Encode(file.getBytes()),
        mimeType: file.getContentType()
      }));

      const payload = {
        sender: sender,
        subject: subject,
        body: body,
        attachments: files
      };

      Logger.log("Sending Payload:\n%s", JSON.stringify(payload, null, 2));

      const options = {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
      };

      try {
        const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
        Logger.log("Webhook response code: %s", response.getResponseCode());
        Logger.log("Webhook response body: %s", response.getContentText());
      } catch (error) {
        Logger.log("Webhook call failed: %s", error.toString());
      }

      // Optional: prevent reprocessing
      msg.markRead();
    }
  }
}
