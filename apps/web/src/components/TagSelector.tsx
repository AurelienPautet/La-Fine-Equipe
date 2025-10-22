import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import type { Tag } from "@lafineequipe/types";
import TagDisplay from "./TagDisplay";
import { useTags, usePostTag } from "../hooks/TagsHooks";
import { FaPlus } from "react-icons/fa";

interface TagSelectorProps {
  setTags: (_tags: Tag[]) => void;
  initialTags: Tag[];
}

interface TagWithState extends Tag {
  isSelected: boolean;
}

const TagSelector: React.FC<TagSelectorProps> = ({ setTags, initialTags }) => {
  const { data: tags, error, isLoading } = useTags();

  const [tagsWithState, setTagsWithState] = useState<TagWithState[]>([]);

  useEffect(() => {
    if (!isLoading && tags) {
      const updatedTagsWithState = tags.map((tag) => {
        const isSelected = initialTags.some((t) => t.id === tag.id);
        return { ...tag, isSelected };
      });
      setTagsWithState(updatedTagsWithState);
    }
  }, [isLoading]);

  function selectTag(tagId: number) {
    setTagsWithState((prevTags) =>
      prevTags.map((t) => (t.id === tagId ? { ...t, isSelected: true } : t))
    );
  }

  function deselectTag(tagId: number) {
    setTagsWithState((prevTags) =>
      prevTags.map((t) => (t.id === tagId ? { ...t, isSelected: false } : t))
    );
  }

  useEffect(() => {
    const selectedTags = tagsWithState
      .filter((tag) => tag.isSelected)
      .map((tag) => ({ id: tag.id, name: tag.name }));
    setTags(selectedTags);
  }, [tagsWithState]);

  const dropdownRef = useRef<HTMLDetailsElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<
    "dropdown-start" | "dropdown-end"
  >("dropdown-start");

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

  const selectedTags = useMemo(() => {
    if (!isLoading) {
      return tagsWithState.filter((tag) => tag.isSelected);
    }
    return [];
  }, [tagsWithState, isLoading]);

  const notSelectedTags = useMemo(() => {
    if (!isLoading) {
      return tagsWithState.filter((tag) => !tag.isSelected);
    }
    return [];
  }, [tagsWithState, isLoading]);

  const postTagMutation = usePostTag();

  function handleCreateTag(name: string) {
    postTagMutation.mutate(name, {
      onSuccess: (newTag) => {
        setTagsWithState((prev) => [...prev, { ...newTag, isSelected: false }]);
      },
    });
  }

  if (isLoading) {
    return <div>Chargement...</div>;
  } else if (error) {
    return <div>Erreur lors du chargement des tags</div>;
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
          {selectedTags.map((tag) => (
            <TagDisplay
              key={tag.id}
              text={tag.name}
              onDelete={() => {
                deselectTag(tag.id);
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
                  notSelectedTags.map((tag: TagWithState) => (
                    <button
                      key={tag.id}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-200 rounded `}
                      onClick={() => {
                        selectTag(tag.id);
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
