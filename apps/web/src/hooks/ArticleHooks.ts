import {useMutation, useQueryClient,useQuery} from '@tanstack/react-query';
import {postArticleMutation} from '../endpoints/ArticlesEnpoints';
import type {ArticleWithTags} from '@lafineequipe/types';
import {getArticle} from '../endpoints/ArticlesEnpoints';


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


export const useArticles = (slug: string) => {
  return useQuery<ArticleWithTags, Error>({
    queryKey: [slug],
    queryFn: () => getArticle(slug),
  });
};