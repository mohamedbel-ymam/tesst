import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs.jsx";
import { Separator } from "../../ui/separator.jsx";
import ParentUpsertForm from "../Forms/ParentUpsertForm.jsx";
import AdminParentList from "../data-table/AdminParentList.jsx";
import UserApi from "../../../services/Api/UserApi.js";

export default function ManageParents() {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [tab, setTab] = useState("parents_list");

  // Load only parents (role=parent)
  const loadParents = async () => {
    setLoading(true);
    try {
      const resp = await UserApi.parents();
      const list = Array.isArray(resp.data)
        ? resp.data
        : Array.isArray(resp.data.data)
        ? resp.data.data
        : [];
      setParents(list);
    } catch (e) {
      console.error("Error loading parents:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParents();
  }, []);

  // Save/create/update parent
  const handleSaveParent = async (values) => {
    if (editingParent) {
      
      await UserApi.update(values.id, { ...values, role: 'parent' });
    } else {
      await UserApi.create({ ...values, role: 'parent' });
    }
    await loadParents();
    setEditingParent(null);
    setTab("parents_list");
  };

  // Edit parent
  const handleEditParent = (parent) => {
    setEditingParent(parent);
    setTab("add_parent");
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingParent(null);
    setTab("parents_list");
  };

  return (
    <div className="space-y-6">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="parents_list">All Parents</TabsTrigger>
          <TabsTrigger value="add_parent">{editingParent ? "Edit Parent" : "Add Parent"}</TabsTrigger>
        </TabsList>

        <TabsContent value="parents_list">
          {loading ? (
            <p>Loading parents…</p>
          ) : (
            <AdminParentList data={parents} onEdit={handleEditParent} />
          )}
        </TabsContent>

        <Separator />

        <TabsContent value="add_parent">
          <div className="max-w-md">
            <ParentUpsertForm
              handleSubmit={handleSaveParent}
              values={editingParent}
              onCancel={handleCancelEdit}
            />
            {editingParent && (
              <button
                className="mt-2 text-blue-500 underline"
                onClick={handleCancelEdit}
                type="button"
              >
                Cancel edit
              </button>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
