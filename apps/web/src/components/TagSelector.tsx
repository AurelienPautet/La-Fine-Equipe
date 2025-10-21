import React from "react";
import { useState, useEffect, useRef } from "react";
import type { Tag } from "@lafineequipe/types";

import { useTags, usePostTag } from "../hooks/TagsHooks";

interface TagSelectorProps {}

interface TagWithState extends Tag {
  isSelected: boolean;
}

const TagSelector: React.FC<TagSelectorProps> = () => {
  const { data: tags, error, isLoading } = useTags();
  const [tagsWithState, setTagsWithState] = useState<TagWithState[]>(
    tags
      ? tags.map((tag) => ({
          ...tag,
          isSelected: false,
        }))
      : []
  );
  const dropdownRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (tags) {
      setTagsWithState(
        tags.map((tag) => ({
          ...tag,
          isSelected: false,
        }))
      );
    }
  }, [tags]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        dropdownRef.current.open = false;
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const postTagMutation = usePostTag();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error loading tags</div>;
  }

  function handleCreateTag(name: string) {
    postTagMutation.mutate(name, {
      onSuccess: (newTag) => {
        setTagsWithState((prev) => [...prev, { ...newTag, isSelected: false }]);
      },
    });
  }

  return (
    <div className="w-fit">
      <h4 className="font-bold mb-2">Select Tags:</h4>
      <details className="dropdown" tabIndex={0} ref={dropdownRef}>
        <summary className="btn m-1">
          {tagsWithState
            .filter((tag) => tag.isSelected)
            .map((tag) => (
              <span
                key={tag.id}
                className="inline-block bg-blue-200 text-blue-800 text-sm px-2 py-1 rounded mr-2 mb-2"
              >
                {tag.name}
              </span>
            ))}
        </summary>
        <ul
          className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
          tabIndex={-1}
        >
          <li>
            {tagsWithState && tagsWithState.length > 0 ? (
              tagsWithState.map((tag: TagWithState) => (
                <button
                  key={tag.id}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-200 rounded ${
                    tag.isSelected ? "bg-gray-300" : ""
                  }`}
                  onClick={() => {
                    setTagsWithState((prevTags) =>
                      prevTags.map((t) =>
                        t.id === tag.id
                          ? { ...t, isSelected: !t.isSelected }
                          : t
                      )
                    );
                  }}
                >
                  {tag.name}
                </button>
              ))
            ) : (
              <div>No tags available</div>
            )}
            <input
              type="text"
              placeholder="Add new tag"
              className="input input-bordered w-full mt-2"
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  console.log("Creating tag:", e.currentTarget.value);
                  handleCreateTag(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
          </li>
        </ul>
      </details>
    </div>
  );
};
export default TagSelector;
