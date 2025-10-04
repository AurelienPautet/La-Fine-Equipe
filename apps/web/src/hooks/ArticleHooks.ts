import {useMutation, useQueryClient} from '@tanstack/react-query';
import {postArticleMutation} from '../endpoints/ArticlesEnpoints';



export const usePostArticle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: postArticleMutation,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["articles"],
            });
        },
    });
};
