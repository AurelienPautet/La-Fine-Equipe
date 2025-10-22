import React from "react";
import { useState, useEffect, useRef } from "react";
import type { Tag } from "@lafineequipe/types";
import TagDisplay from "./TagDisplay";
import { useTags, usePostTag } from "../hooks/TagsHooks";
import { FaPlus } from "react-icons/fa";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<
    "dropdown-start" | "dropdown-end"
  >("dropdown-start");

  useEffect(() => {
    if (tags) {
      const existingSelections = new Map(
        tagsWithState.map((tag) => [tag.id, tag.isSelected])
      );
      setTagsWithState(
        tags.map((tag) => ({
          ...tag,
          isSelected: existingSelections.get(tag.id) ?? false,
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

  useEffect(() => {
    const updateDropdownPosition = () => {
      if (dropdownRef.current && containerRef.current) {
        const dropdownRect = dropdownRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;
        if (dropdownRect.left < containerCenter) {
          setDropdownPosition("dropdown-start");
        } else {
          setDropdownPosition("dropdown-end");
        }
      }
    };

    updateDropdownPosition();
    window.addEventListener("resize", updateDropdownPosition);

    return () => {
      window.removeEventListener("resize", updateDropdownPosition);
    };
  }, [tagsWithState]);

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
    <div className="w-full ">
      <div className="label flex flex-col  items-start">
        <h4 className="label-text text-sm font-semibold">Tags sélectionnés:</h4>
        <div
          className="flex w-full flex-row flex-wrap items-center gap-2"
          ref={containerRef}
        >
          {" "}
          {tagsWithState
            .filter((tag) => tag.isSelected)
            .map((tag) => (
              <TagDisplay
                key={tag.id}
                text={tag.name}
                onDelete={() => {
                  setTagsWithState((prevTags) =>
                    prevTags.map((t) =>
                      t.id === tag.id ? { ...t, isSelected: false } : t
                    )
                  );
                }}
              />
            ))}
          <details
            className={`dropdown dropdown-bottom ${dropdownPosition}`}
            tabIndex={0}
            ref={dropdownRef}
          >
            <summary className="btn btn-circle btn-sm btn-primary ">
              <FaPlus />
            </summary>
            <ul className="menu  dropdown-content t  bg-white rounded-box  w-40 p-2 shadow-sm">
              <li>
                {tagsWithState && tagsWithState.length > 0 ? (
                  tagsWithState
                    .filter((tag) => !tag.isSelected)
                    .map((tag: TagWithState) => (
                      <button
                        key={tag.id}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-200 rounded `}
                        onClick={() => {
                          setTagsWithState((prevTags) =>
                            prevTags.map((t) =>
                              t.id === tag.id ? { ...t, isSelected: true } : t
                            )
                          );
                        }}
                      >
                        {tag.name}
                      </button>
                    ))
                ) : (
                  <div>Aucun tag disponible</div>
                )}
                <input
                  type="text"
                  placeholder="Ajouter un tag"
                  className="input input-bordered border-primary bg-white w-full "
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
      </div>
    </div>
  );
};
export default TagSelector;
