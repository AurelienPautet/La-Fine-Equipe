import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  postArticleMutation,
  getArticle,
  getLatestArticle,
  getArticles,
} from "../endpoints/ArticlesEnpoints";
import type { ArticleWithTags } from "@lafineequipe/types";

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

export const useArticles = () => {
  return useQuery<ArticleWithTags[], Error>({
    queryKey: ["articles"],
    queryFn: () => getArticles(),
  });
};

export const useArticle = (slug: string) => {
  return useQuery<ArticleWithTags, Error>({
    queryKey: [slug],
    queryFn: () => getArticle(slug),
  });
};

export const useLatestArticle = () => {
  return useQuery<ArticleWithTags, Error>({
    queryKey: ["latest-article"],
    queryFn: () => getLatestArticle(),
  });
};
