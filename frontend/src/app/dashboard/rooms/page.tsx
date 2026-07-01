// ================================
// ROOMS PAGE (Dashboard)
// Manage rooms for the company.
// Admin/Manager can create, edit, and delete rooms.
// ================================

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { resolveAssetUrl, roomApi } from "@/lib/api";
import { formatPrice } from "@/lib/helpers";
import { Room } from "@/types";
import ImageUpload from "@/components/ImageUpload";

function RoomImage({ room }: { room: Room }) {
  const [failed, setFailed] = useState(false);
  const src = resolveAssetUrl(room.images?.[0]);

  if (!src || failed) {
    return (
      <div style={{ width: "100%", height: "160px", borderRadius: "12px", overflow: "hidden", marginBottom: "14px", background: "#EFE7D7", display: "flex", alignItems: "center", justifyContent: "center", color: "#5C6470", fontSize: "13px" }}>
        No room image
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "160px", borderRadius: "12px", overflow: "hidden", marginBottom: "14px", background: "#EFE7D7" }}>
      <img
        src={src}
        alt={room.name}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export default function RoomsPage() {
  const { user } = useAuth();
  const canEdit = user?.role === "admin" || user?.role === "manager";

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formError, setFormError] = useState("");
  const [actionError, setActionError] = useState("");

  // Form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "double" as Room["type"],
    capacity: 2,
    pricePerNight: 0,
    amenities: "",
    images: [] as string[],
  });

  // Load rooms
  useEffect(() => {
    loadRooms();
  }, []);

  async function loadRooms() {
    try {
      setActionError("");
      const data = await roomApi.getAll();
      setRooms(data.rooms);
    } catch (error: any) {
      console.error("Error loading rooms:", error);
      setActionError(error.message || "Failed to load rooms.");
    } finally {
      setLoading(false);
    }
  }

  // Open form to create a new room
  function openCreateForm() {
    setEditingRoom(null);
    setForm({
      name: "",
      description: "",
      type: "double",
      capacity: 2,
      pricePerNight: 0,
      amenities: "",
      images: [],
    });
    setFormError("");
    setShowForm(true);
  }

  // Open form to edit an existing room
  function openEditForm(room: Room) {
    setEditingRoom(room);
    setForm({
      name: room.name,
      description: room.description,
      type: room.type,
      capacity: room.capacity,
      pricePerNight: room.pricePerNight / 100, // Convert cents to dollars for the form
      amenities: room.amenities.join(", "),
      images: room.images || [],
    });
    setFormError("");
    setShowForm(true);
  }

  function validateRoomForm() {
    if (!form.name.trim()) {
      return "Room name is required.";
    }
    if (!form.type) {
      return "Room type is required.";
    }
    if (!Number.isInteger(form.capacity) || form.capacity < 1) {
      return "Capacity must be a whole number greater than or equal to 1.";
    }
    if (!Number.isFinite(form.pricePerNight) || form.pricePerNight <= 0) {
      return "Price per night must be greater than 0.";
    }
    return "";
  }

  // Save room (create or update)
  async function handleSave() {
    const validationError = validateRoomForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      const roomData = {
        name: form.name.trim(),
        description: form.description.trim(),
        type: form.type,
        capacity: form.capacity,
        pricePerNight: Math.round(form.pricePerNight * 100), // Convert dollars to cents
        amenities: form.amenities
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        images: form.images,
      };

      if (editingRoom) {
        await roomApi.update(editingRoom._id, roomData);
      } else {
        await roomApi.create(roomData);
      }

      setShowForm(false);
      setFormError("");
      loadRooms(); // Refresh the list
    } catch (error: any) {
      console.error("Error saving room:", error);
      setFormError(error.message || "Failed to save room.");
    }
  }

  // Delete room (soft delete)
  async function handleDelete(roomId: string) {
    if (!confirm("Deactivate this room? It will stay in the database and appear as inactive.")) return;

    try {
      setActionError("");
      const data = await roomApi.delete(roomId);

      if (data.room) {
        setRooms((currentRooms) =>
          currentRooms.map((room) =>
            room._id === roomId ? { ...room, ...data.room } : room
          )
        );
      } else {
        await loadRooms();
      }
    } catch (error: any) {
      console.error("Error deleting room:", error);
      setActionError(error.message || "Failed to deactivate room.");
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Rooms</h1>
          <p className="page-subtitle">Manage accommodation inventory</p>
        </div>
        {canEdit && (
          <button onClick={openCreateForm} className="btn-primary">
            + Add Room
          </button>
        )}
      </div>

      {actionError && <div className="alert-error">{actionError}</div>}

      {/* ================================
          ROOM FORM (Create/Edit)
          ================================ */}
      {showForm && (
        <div className="form-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">
            {editingRoom ? "Edit Room" : "New Room"}
          </h2>

          {formError && <div className="alert-error">{formError}</div>}

          <div className="form-grid">
            <div>
              <label className="label">Room Name</label>
              <input
                type="text"
                className="input"
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  setFormError("");
                }}
                placeholder="e.g., Ocean View Suite"
                required
              />
            </div>

            <div>
              <label className="label">Type</label>
              <select
                className="input"
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value as Room["type"] })
                }
                required
              >
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="suite">Suite</option>
                <option value="dorm">Dorm</option>
                <option value="bungalow">Bungalow</option>
              </select>
            </div>

            <div>
              <label className="label">Capacity (max guests)</label>
              <input
                type="number"
                className="input"
                value={form.capacity}
                onChange={(e) =>
                  setForm({ ...form, capacity: Number(e.target.value) })
                }
                min={1}
                step={1}
                required
              />
            </div>

            <div>
              <label className="label">Price per Night ($)</label>
              <input
                type="number"
                className="input"
                value={form.pricePerNight}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pricePerNight: Number(e.target.value),
                  })
                }
                min={0.01}
                step={0.01}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Description</label>
              <textarea
                className="input"
                rows={2}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Describe the room..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Amenities (comma-separated)</label>
              <input
                type="text"
                className="input"
                value={form.amenities}
                onChange={(e) =>
                  setForm({ ...form, amenities: e.target.value })
                }
                placeholder="e.g., wifi, ac, ocean-view, balcony"
              />
            </div>

              <div className="md:col-span-2">
              <ImageUpload
                  label="Room Photo"
                  defaultImage={form.images?.[0]}
                  onUpload={(url) => setForm({ ...form, images: [url] })}
                />
              </div>
          </div>

          <div className="form-actions">
            <button onClick={handleSave} className="btn-primary">
              {editingRoom ? "Save Changes" : "Create Room"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ================================
          ROOMS LIST
          ================================ */}
      {loading ? (
        <div className="py-12">
          <span className="loading-text">Loading rooms...</span>
        </div>
      ) : rooms.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">No rooms yet. Add your first room.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <div key={room._id} className="card-hover group">
              <RoomImage room={room} />

              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{room.name}</h3>
                  <p className="text-gray-400 text-sm capitalize mt-0.5">
                    {room.type} · Up to {room.capacity} guests
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">
                    {formatPrice(room.pricePerNight)}
                  </p>
                  <p className="text-gray-400 text-xs">/night</p>
                </div>
              </div>

              <p className="text-gray-500 text-sm mt-3 line-clamp-2">{room.description}</p>

              {/* Amenities */}
              {room.amenities.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {room.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="badge bg-gray-100 text-gray-700"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              )}

              {/* Status badge */}
              <div className="mt-3">
                <span
                  className={`badge ${
                    room.isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {room.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Edit/Delete buttons */}
              {canEdit && (
                <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => openEditForm(room)}
                    className="text-sm font-medium text-gray-900 hover:text-gray-800 transition-colors"
                  >
                    Edit
                  </button>
                  {user?.role === "admin" && room.isActive && (
                    <button
                      onClick={() => handleDelete(room._id)}
                      className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
                    >
                      Deactivate
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
