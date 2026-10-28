import Button from "@/features/common/components/Button";

// Lo que ve un invitado al finalizar el pedido; la canasta se conserva para cuando inicie sesión
export default function InstruccionInvitado() {
  return (
    <div className="border border-linea bg-carbon/70 p-6 sm:p-8">
      <p className="text-[0.78rem] text-marfil">Para hacer tu pedido inicia sesión o regístrate.</p>
      <p className="mt-2 text-[0.73rem] text-gris">
        Ten a mano tu dirección de envío, ciudad y el método de pago que prefieras (contra entrega, transferencia o
        tarjeta al recibir).
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button href="/login">Iniciar sesión</Button>
        <Button href="/registro" variante="secundario">
          Registrarme
        </Button>
      </div>
    </div>
  );
}
