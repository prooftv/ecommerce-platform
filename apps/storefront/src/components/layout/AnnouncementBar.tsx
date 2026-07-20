import { getActiveAnnouncementBar } from "@/lib/sanity/queries";
import { AnnouncementBarClient } from "./AnnouncementBarClient";

export async function AnnouncementBar() {
  const bar = await getActiveAnnouncementBar();
  if (!bar) return null;

  return (
    <AnnouncementBarClient
      id={bar._id}
      text={bar.text}
      href={bar.href}
      linkLabel={bar.linkLabel}
      backgroundColor={bar.backgroundColor ?? "#111827"}
      textColor={bar.textColor ?? "#ffffff"}
      dismissible={bar.dismissible ?? true}
    />
  );
}
