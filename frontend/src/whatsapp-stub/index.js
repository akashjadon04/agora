export const AccountForm = { render: () => null }
export const useAccount = () => ({})
export const TemplateContent = { render: () => null }
export const TemplateForm = { render: () => null }
export const TemplatePreview = { render: () => null }
export const useTemplate = () => ({})
export const useTemplates = () => ({})
export const MessageInput = { render: () => null }
export const MessageList = { render: () => null }
export const useMessages = () => ({})
export const serverErrorMessage = (err) => err?.message || ''

export default {
  AccountForm,
  useAccount,
  TemplateContent,
  TemplateForm,
  TemplatePreview,
  useTemplate,
  useTemplates,
  MessageInput,
  MessageList,
  useMessages,
  serverErrorMessage,
}
