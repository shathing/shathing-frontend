import { Activity } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function LoadingButton({
  children,
  isLoading,
  ...props
}: React.ComponentProps<"button"> & { isLoading: boolean }) {
  return (
    <Button disabled={isLoading} {...props}>
      <Activity mode={isLoading ? "visible" : "hidden"}>
        <Spinner />
      </Activity>
      {children}
    </Button>
  );
}
