import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  postArticleMutation,
  getArticle,
  getLatestsArticle,
  getArticles,
  editArticleMutation,
} from "../endpoints/ArticlesEnpoints";
import type { ArticleWithTags } from "@lafineequipe/types";

export const useArticles = () => {
  return useQuery<ArticleWithTags[], Error>({
    queryKey: ["articles"],
    queryFn: () => getArticles(),
  });
};

export const useArticle = (slug: string) => {
  return useQuery<ArticleWithTags, Error>({
    queryKey: ["article", slug],
    queryFn: () => getArticle(slug),
  });
};

export const useLatestsArticle = () => {
  return useQuery<ArticleWithTags[], Error>({
    queryKey: ["latests-article"],
    queryFn: () => getLatestsArticle(),
  });
};

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

export const useEditArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editArticleMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["articles"],
      });
    },
  });
};
