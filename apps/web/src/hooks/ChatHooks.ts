import { useQueryClient, useMutation } from "@tanstack/react-query";
import { postChatMessage } from "../endpoints/ChatEndpoints";
import type { Message } from "../../../../packages/types/src/message";

export const usePostChatMessage = (
  onChunk: (chunk: string, type: string) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (messages: Message[]) => postChatMessage(messages, onChunk),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatMessages"] });
    },
  });
};
