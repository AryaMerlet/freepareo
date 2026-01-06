import AdminCrud from "./AdminCrud";
import Crud from "./Users"; 

export default function App() {
  return <AdminCrud crudComponent={<Crud />} />;
}
