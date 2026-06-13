import React, {
  useEffect,
  useState,
} from "react";

import {
  Folder,
  Plus,
  Trash2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import axiosInstance from "../lib/axios";

const QuestionBank = () => {
  const navigate = useNavigate();

  const [folders, setFolders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [showModal, setShowModal] =
    useState(false);

  const [folderName, setFolderName] =
    useState("");

  const fetchFolders = async () => {
    try {
      const res =
        await axiosInstance.get(
          "/question-folders"
        );

      setFolders(
        res.data.folders || []
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const createFolder = async () => {
    if (!folderName.trim()) return;

    try {
      await axiosInstance.post(
        "/question-folders",
        {
          name: folderName,
        }
      );

      setFolderName("");
      setShowModal(false);

      fetchFolders();
    } catch (error) {
      console.log(error);
      alert(
        error?.response?.data?.message ||
          "Failed to create folder"
      );
    }
  };

  const deleteFolder = async (
    e,
    folderId
  ) => {
    e.stopPropagation();

    const confirmDelete =
      window.confirm(
        "Delete this folder and all questions inside it?"
      );

    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(
        `/question-folders/${folderId}`
      );

      fetchFolders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-base-100">
      {/* Header */}

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          Question Bank
        </h1>

        <button
          onClick={() =>
            setShowModal(true)
          }
          className="btn btn-primary"
        >
          <Plus size={18} />
          New Folder
        </button>
      </div>

      {/* Loading */}

      {loading ? (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : folders.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold">
            No folders found
          </h2>

          <p className="text-base-content/70 mt-2">
            Create your first topic
            folder.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {folders.map((folder) => (
            <div
              key={folder._id}
              onClick={() =>
                navigate(
                  `/question-bank/${folder._id}`
                )
              }
              className="card bg-base-200 shadow cursor-pointer hover:shadow-xl transition-all"
            >
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Folder
                      size={28}
                    />

                    <h2 className="font-semibold text-lg">
                      {folder.name}
                    </h2>
                  </div>

                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={(e) =>
                      deleteFolder(
                        e,
                        folder._id
                      )
                    }
                  >
                    <Trash2
                      size={18}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Folder Modal */}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-base-100 rounded-xl p-6 w-[90%] max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">
              Create Folder
            </h2>

            <input
              type="text"
              placeholder="Folder Name"
              className="input input-bordered w-full"
              value={folderName}
              onChange={(e) =>
                setFolderName(
                  e.target.value
                )
              }
            />

            <div className="flex justify-end gap-3 mt-5">
              <button
                className="btn"
                onClick={() => {
                  setShowModal(
                    false
                  );
                  setFolderName(
                    ""
                  );
                }}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={
                  createFolder
                }
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBank;