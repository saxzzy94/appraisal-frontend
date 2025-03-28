# ChatInput Update Plan: Preserve Input on Error

## Background  
Currently, when a user sends a message and an error occurs (for example, if the API call fails), the ChatInput component clears the text in the input field. This forces the user to retype the message, which is not ideal in cases such as intermittent errors or validation issues.

## Proposed Solution  
Modify the ChatInput component so that the input value is only cleared if the message is successfully sent. If there is an error in sending the message, the text should be preserved within the textarea, allowing the user to edit and retry sending without retyping everything.

## Implementation Details  

1. **Update the `handleSubmit` Function:**  
   - Wrap the API call in a try-catch block.
   - On success, call `setMessage("")` to clear the input.
   - On error (in the catch block), log the error or propagate it to the parent (which may display a toast), but **do not** clear the message input.

   **Example Pseudocode:**
   ```tsx
   const handleSubmit = async () => {
     if (!message.trim() || isLoading) return;
     
     try {
       await onSubmit(message);
       // Clear the input only if the send is successful.
       setMessage("");
       if (textareaRef.current) {
         textareaRef.current.style.height = "auto";
       }
     } catch (error) {
       console.error("Failed to send message:", error);
       // Don't clear the input, so the user can re-attempt.
     }
   };
   ```

2. **Error Propagation:**  
   - Ensure that the parent component (e.g., ChatPage) handles errors via toast notifications or similar UI element.
   - The ChatInput component should not interfere with error handling; it simply preserves the message text when an error occurs.

3. **Testing:**  
   - Verify that when sending a message with no errors, the textarea is cleared.
   - Simulate an error (e.g., disconnect the network or force an error response from the server) and verify that the message remains in the textarea.

## Next Steps  
- Update the implementation in `src/components/chat/ChatInput.tsx` as described.
- Test across different error cases to ensure a smooth user experience.
- Review and iterate based on feedback.

This plan ensures a better user experience by preserving unsent message content, reducing frustration when errors occur.
