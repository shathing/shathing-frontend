import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import LocaleSwitcher from "./LocaleSwitcher";

const replaceMock = vi.fn();
const useLocaleMock = vi.fn();
const useTranslationsMock = vi.fn();
const usePathnameMock = vi.fn();
const useParamsMock = vi.fn();

vi.mock("next-intl", () => ({
  useLocale: () => useLocaleMock(),
  useTranslations: (...args: unknown[]) => useTranslationsMock(...args),
}));

vi.mock("next/navigation", () => ({
  useParams: () => useParamsMock(),
}));

vi.mock("@/i18n/navigation", () => ({
  usePathname: () => usePathnameMock(),
  useRouter: () => ({ replace: replaceMock }),
}));

describe("LocaleSwitcher 컴포넌트", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useLocaleMock.mockReturnValue("en");
    usePathnameMock.mockReturnValue("/en");
    useParamsMock.mockReturnValue({ locale: "en" });
    useTranslationsMock.mockReturnValue((_key: string, values: { locale: string }) =>
      values.locale === "en" ? "English" : "한국어",
    );
  });

  afterEach(() => {
    cleanup();
  });

  it("언어 옵션을 렌더링하고 현재 언어를 선택한다", () => {
    render(<LocaleSwitcher />);

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select).toBeDefined();
    expect(select.value).toBe("en");
    expect(screen.getByRole("option", { name: "English" })).toBeDefined();
    expect(screen.getByRole("option", { name: "한국어" })).toBeDefined();
  });

  it("다른 언어를 선택하면 router.replace를 호출한다", () => {
    render(<LocaleSwitcher />);

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "ko" } });

    expect(replaceMock).toHaveBeenCalledWith({ pathname: "/en", params: { locale: "en" } }, { locale: "ko" });
  });
});
