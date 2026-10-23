import ServiceForm from "@/components/admin/ServiceForm";

export default function NewServicePage() {
  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
          إضافة خدمة جديدة
        </h1>
        <p className="text-white/60">املأ البيانات وأنشئ خدمة جديدة</p>
      </div>

      <ServiceForm mode="create" />
    </div>
  );
}