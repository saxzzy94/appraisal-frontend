# Chat API Response Mapping Update Plan

## Background
The API response from `/chat/start` returns data in the following structure:
```
{
  "status": "success",
  "data": {
    "message": {
      "role": "assistant",
      "content": "Dit appartement ...",
      "timestamp": "2025-03-27T15:42:33.688Z",
      "_id": "67e571e9a13e1289dc0bea98"
    },
    "sessionId": "yyrmoau9bins5jcyolgqyd"
  }
}
```
In our current implementation in the `useChatSession` hook, the assistant’s message is being extracted from `data.response`. This mismatch causes the assistant’s response not to display within the chat interface.

## Proposed Solution
1. **Update the onSuccess Callback in useChatSession:**
   - Modify the callback to extract the assistant’s message from `data.data.message` rather than `data.response`.

2. **Sample Code Change:**

   **Before:**
   ```tsx
   onSuccess: (data, variables) => {
     const userMessage: Message = {
       content: variables,
       role: "user",
       timestamp: new Date().toISOString(),
     };

     const assistantMessage: Message = {
       content: data.response, // Incorrect mapping
       role: "assistant",
       timestamp: new Date().toISOString(),
     };

     setMessages((prev) => [...prev, userMessage, assistantMessage]);
   },
   ```

   **After:**
   ```tsx
   onSuccess: (data, variables) => {
     const userMessage: Message = {
       content: variables,
       role: "user",
       timestamp: new Date().toISOString(),
     };

     // Extract assistant message from the correct property
     const assistant = data.data && data.data.message;
     const assistantMessage: Message = {
       content: assistant?.content || "",
       role: assistant?.role || "assistant",
       timestamp: assistant?.timestamp || new Date().toISOString(),
     };

     setMessages((prev) => [...prev, userMessage, assistantMessage]);
   },
   ```

3. **Benefits:**
   - This change ensures that the assistant’s response message is correctly captured and displayed in the chat.
   - Users will see the complete response from the API without missing the analysis content.

## Next Steps
- Review this plan.
- Once approved, implement this change in the `src/hooks/useChatSession.ts` file.
- Test the chat feature to verify that the assistant's response now appears correctly in the chat interface.

Are you satisfied with this plan, or would you like any modifications?