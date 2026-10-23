import PortfolioForm from "@/components/admin/PortfolioForm";

export default function NewPortfolioPage() {
  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
          إضافة مشروع جديد
        </h1>
        <p className="text-white/60">
          املأ البيانات وأضف مشروعك لمعرض الأعمال
        </p>
      </div>

      <PortfolioForm mode="create" />
    </div>
  );
}