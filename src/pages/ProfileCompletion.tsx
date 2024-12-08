import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/shadcn/Card";
import { useStore } from "@hooks/useStore";
import { lazy } from "react";

const WhatsAppVerification = lazy(() =>
  import("@components/WhatsAppVerification").then(
    ({ WhatsAppVerification }) => ({
      default: WhatsAppVerification,
    })
  )
);

const TimeZoneForm = lazy(() =>
  import("@components/TimeZoneForm").then(({ TimeZoneForm }) => ({
    default: TimeZoneForm,
  }))
);

function ProfileCompletion() {
  const user = useStore((state) => state.user);

  if (user?.phoneVerified === false) {
    return (
      <div className="flex flex-col justify-center h-screen mx-6">
        <Card>
          <CardHeader>
            <CardTitle>Registrasi Nomor WhatsApp</CardTitle>
            <CardDescription>
              Daftarkan nomor WhatsApp kamu agar dapat menerima pengingat salat.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WhatsAppVerification />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center h-screen mx-6">
      <Card>
        <CardHeader>
          <CardTitle>Pilih Zona Waktu</CardTitle>
          <CardDescription>
            Zona waktu yang dipilih akan menjadi acuan pengingat salat.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TimeZoneForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfileCompletion;
