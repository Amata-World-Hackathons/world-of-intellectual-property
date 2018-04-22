import MapboxMap from "./MapboxMap";

export const MapBackdropLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <MapboxMap className="relative w-full h-full" />

      <div
        id="global-canvas"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      {children}
    </div>
  );
};

export function applyMapBackdropLayout(page: React.ReactNode) {
  return <MapBackdropLayout>{page}</MapBackdropLayout>;
}
