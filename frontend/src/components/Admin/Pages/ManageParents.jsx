import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs.jsx";
import { Separator } from "../../ui/separator.jsx";
import ParentUpsertForm from "../Forms/ParentUpsertForm.jsx";
import AdminParentList from "../data-table/AdminParentList.jsx";
import ParentApi from "../../../services/Api/Admin/ParentApi.js";

export default function ManageParents() {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1) Load parents from the API
  const fetchParents = async () => {
    setLoading(true);
    try {
      const resp = await ParentApi.all();
      // normalize resp.data or resp.data.data
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

  // 2) Fetch once on mount
  useEffect(() => {
    fetchParents();
  }, []);

  // 3) After a successful create/update, re-fetch
  const handleSaveParent = async (values) => {
    const result = await ParentApi.create(values);
    await fetchParents();
    return result;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="parents_list">
        <TabsList>
          <TabsTrigger value="parents_list">All Parents</TabsTrigger>
          <TabsTrigger value="add_parent">Add Parent</TabsTrigger>
        </TabsList>

        <TabsContent value="parents_list">
          {loading
            ? <p>Loading parents…</p>
            : <AdminParentList data={parents} />}
        </TabsContent>

        <Separator />

        <TabsContent value="add_parent">
          <div className="max-w-md">
            <ParentUpsertForm handleSubmit={handleSaveParent} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
