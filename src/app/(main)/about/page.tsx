"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function About() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col gap-12">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Về chúng tôi
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Chúng tôi là cửa hàng giày chuyên cung cấp các sản phẩm chất lượng
              cao với đa dạng mẫu mã, phù hợp với mọi nhu cầu và phong cách của
              bạn.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Với hơn 10 năm kinh nghiệm trong ngành, chúng tôi tự hào mang đến
              cho khách hàng những sản phẩm chính hãng, giá cả hợp lý và dịch vụ
              chăm sóc khách hàng tốt nhất.
            </p>
            <Button onClick={() => router.push("/products")} className="mt-4">
              Xem sản phẩm
            </Button>
          </div>
          <div className="w-full md:w-1/2 relative h-[400px]">
            <Image
              src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=2071&auto=format&fit=crop"
              alt="Cửa hàng giày của chúng tôi"
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Sứ mệnh</h2>
            <p className="text-gray-600">
              Chúng tôi cam kết mang đến cho khách hàng những sản phẩm giày chất
              lượng cao, đa dạng về mẫu mã và phù hợp với mọi nhu cầu. Chúng tôi
              luôn nỗ lực để cải thiện dịch vụ và trải nghiệm mua sắm của khách
              hàng.
            </p>
          </div>
          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Tầm nhìn</h2>
            <p className="text-gray-600">
              Trở thành cửa hàng giày hàng đầu, được khách hàng tin tưởng và yêu
              mến. Chúng tôi mong muốn xây dựng một thương hiệu uy tín, góp phần
              nâng cao chất lượng cuộc sống thông qua những sản phẩm chất lượng.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Giá trị cốt lõi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Chất lượng
                </h3>
                <p className="text-gray-600">
                  Cam kết cung cấp sản phẩm chính hãng, chất lượng cao với giá
                  cả hợp lý.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Dịch vụ
                </h3>
                <p className="text-gray-600">
                  Luôn lắng nghe và phục vụ khách hàng với thái độ chuyên
                  nghiệp, nhiệt tình.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Đổi mới
                </h3>
                <p className="text-gray-600">
                  Liên tục cập nhật xu hướng mới, đa dạng hóa sản phẩm để đáp
                  ứng nhu cầu khách hàng.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Đội ngũ của chúng tôi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
                  alt="Người sáng lập"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Nguyễn Văn A
              </h3>
              <p className="text-gray-600">Người sáng lập & CEO</p>
            </div>
            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
                  alt="Quản lý kinh doanh"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Trần Thị B
              </h3>
              <p className="text-gray-600">Quản lý kinh doanh</p>
            </div>
            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
                  alt="Quản lý kho"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Lê Văn C</h3>
              <p className="text-gray-600">Quản lý kho</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
