"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AppTopBar } from "@/components/AppTopBar";
import { Check, ChevronDown, ChevronUp, PlusIcon, UploadIcon, X } from "@/components/Icons";
import { Spinner } from "@/components/Spinner";
import { Toast, useToast } from "@/components/Toast";
import { useAuthProfile } from "@/lib/useAuthProfile";
import {
  createItem,
  fetchItemTypes,
  fetchTags,
  fetchUploadLimits,
  uploadAsset,
  type ItemTypeDef,
  type TagDef,
  type UploadLimits,
} from "@/lib/home";
import styles from "./add.module.css";

type Ripple = { id: number; x: number; y: number };

function verifyImage(url: string) {
  return new Promise<boolean>((resolve) => {
    const img = new Image();
    const done = (ok: boolean) => {
      img.onload = null;
      img.onerror = null;
      resolve(ok);
    };
    img.onload = () => done(true);
    img.onerror = () => done(false);
    img.src = url;
  });
}

function bumpVersion(v: string, dir: 1 | -1) {
  const parts = v.trim().split(".").map((n) => Number.parseInt(n, 10));
  while (parts.length < 3) parts.push(0);
  const i = 2;
  const next = (Number.isFinite(parts[i]) ? parts[i] : 0) + dir;
  parts[i] = Math.max(0, next);
  return parts.slice(0, 3).join(".");
}

export default function AddBuildPage() {
  const profile = useAuthProfile();
  const router = useRouter();
  const { toast, show, dismiss } = useToast();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [types, setTypes] = useState<ItemTypeDef[]>([]);
  const [typeOpen, setTypeOpen] = useState(false);
  const typeRef = useRef<HTMLDivElement>(null);
  const [version, setVersion] = useState("1.0.0");

  const [artworkUrl, setArtworkUrl] = useState("");
  const [artworkPublic, setArtworkPublic] = useState(false);
  const [artworkBusy, setArtworkBusy] = useState(false);
  const [artworkError, setArtworkError] = useState("");
  const artFile = useRef<HTMLInputElement>(null);

  const [banners, setBanners] = useState<string[]>([]);
  const [bannerPublic, setBannerPublic] = useState(false);
  const [bannerInputs, setBannerInputs] = useState<string[]>([""]);
  const [bannerBusy, setBannerBusy] = useState<Record<number, boolean>>({});
  const [bannerError, setBannerError] = useState("");
  const bannerFile = useRef<HTMLInputElement>(null);

  const [tags, setTags] = useState<TagDef[]>([]);
  const [picked, setPicked] = useState<string[]>([]);
  const [ripples, setRipples] = useState<Record<string, Ripple | undefined>>({});

  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceIsFile, setSourceIsFile] = useState(false);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceBusy, setSourceBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const sourceInput = useRef<HTMLInputElement>(null);

  const [limits, setLimits] = useState<UploadLimits | null>(null);
  const [dialog, setDialog] = useState<{ title: string; copy: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!typeOpen) return;
    const on = (e: MouseEvent) => {
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) setTypeOpen(false);
    };
    window.addEventListener("pointerdown", on);
    return () => window.removeEventListener("pointerdown", on);
  }, [typeOpen]);

  useEffect(() => {
    fetchItemTypes().then((res) => {
      if (res.data) setTypes(res.data);
    });
    fetchTags().then((res) => {
      if (res.data) setTags(res.data);
    });
    fetchUploadLimits().then((res) => {
      if (res.data) setLimits(res.data);
    });
  }, []);

  useEffect(() => {
    if (!artworkPublic) return;
    const raw = artworkUrl.trim();
    if (!raw) {
      setArtworkError("");
      setArtworkBusy(false);
      return;
    }
    let live = true;
    setArtworkBusy(true);
    const t = window.setTimeout(() => {
      verifyImage(raw).then((ok) => {
        if (!live) return;
        setArtworkBusy(false);
        if (!ok) {
          setArtworkError("That image URL could not be loaded.");
          show("That image URL could not be loaded.", "error");
        } else {
          setArtworkError("");
        }
      });
    }, 380);
    return () => {
      live = false;
      window.clearTimeout(t);
    };
  }, [artworkPublic, artworkUrl, show]);

  const previewName = name.trim() || "Project Name";
  const selectedType = types.find((t) => t.slug === type);
  const typeLabel = selectedType?.label;
  const isScreenshots = selectedType?.galleryKind === "screenshots";
  const galleryLabel = isScreenshots ? "Screenshots" : "Banners";
  const artReady = Boolean(artworkUrl) && !artworkBusy && !artworkError;

  const canSubmit = useMemo(() => {
    return name.trim().length >= 2 && description.trim().length >= 1 && type && artReady && !saving;
  }, [name, description, type, artReady, saving]);

  const pickArtwork = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      show("Artwork must be an image.", "error");
      return;
    }
    setArtworkBusy(true);
    setArtworkError("");
    const res = await uploadAsset(file, "artwork");
    setArtworkBusy(false);
    if (!res.data) {
      show(res.error ?? "could not upload artwork", "error");
      setArtworkError(res.error ?? "could not upload artwork");
      return;
    }
    setArtworkUrl(res.data.url);
  };

  const pickBanner = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      show("Banners must be images.", "error");
      return;
    }
    const idx = banners.length;
    setBannerBusy((b) => ({ ...b, [idx]: true }));
    const res = await uploadAsset(file, "banner");
    setBannerBusy((b) => {
      const n = { ...b };
      delete n[idx];
      return n;
    });
    if (!res.data) {
      show(res.error ?? "could not upload banner", "error");
      return;
    }
    setBanners((cur) => [...cur, res.data!.url]);
  };

  const applyBannerUrl = (index: number, raw: string) => {
    setBannerInputs((cur) => {
      const next = [...cur];
      next[index] = raw;
      return next;
    });
  };

  useEffect(() => {
    if (!bannerPublic) return;
    const timers: number[] = [];
    bannerInputs.forEach((raw, index) => {
      const url = raw.trim();
      if (!url) return;
      setBannerBusy((b) => ({ ...b, [index]: true }));
      const t = window.setTimeout(() => {
        verifyImage(url).then((ok) => {
          setBannerBusy((b) => {
            const n = { ...b };
            delete n[index];
            return n;
          });
          if (!ok) {
            setBannerError("One of the banner URLs could not be loaded.");
            show("That banner URL could not be loaded.", "error");
            return;
          }
          setBannerError("");
          setBanners((cur) => {
            const copy = [...cur];
            copy[index] = url;
            return copy;
          });
        });
      }, 380);
      timers.push(t);
    });
    return () => {
      for (const t of timers) window.clearTimeout(t);
    };
  }, [bannerPublic, bannerInputs, show]);

  const toggleTag = (slug: string, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ripple = { id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top };
    setRipples((r) => ({ ...r, [slug]: ripple }));
    window.setTimeout(() => {
      setRipples((r) => {
        const n = { ...r };
        delete n[slug];
        return n;
      });
    }, 520);
    setPicked((cur) => (cur.includes(slug) ? cur.filter((s) => s !== slug) : cur.length < 8 ? [...cur, slug] : cur));
  };

  const notifyZip = () => {
    const max = limits?.maxDisplay ?? "50 MB";
    setDialog({
      title: "One file, or a zip",
      copy: `Drop a single file, or zip the set. Max size is ${max}.`,
    });
  };

  const takeSource = (files: FileList | File[]) => {
    const list = Array.from(files);
    if (list.length === 0) return;
    if (list.length > 1) {
      notifyZip();
      return;
    }
    const file = list[0];
    const max = limits?.maxBytes ?? 50 * 1024 * 1024;
    if (file.size > max) {
      setDialog({
        title: "File is too large",
        copy: `${file.name} is over the ${limits?.maxDisplay ?? "50 MB"} limit. Zip it down or pick a smaller file.`,
      });
      return;
    }
    setSourceFile(file);
  };

  const publish = async () => {
    if (!canSubmit) return;
    setSaving(true);
    let source = sourceUrl.trim();
    if (sourceIsFile) {
      if (!sourceFile) {
        setSaving(false);
        show("Pick a source file first.", "error");
        return;
      }
      setSourceBusy(true);
      const up = await uploadAsset(sourceFile, "source");
      setSourceBusy(false);
      if (!up.data) {
        setSaving(false);
        show(up.error ?? "could not upload source", "error");
        return;
      }
      source = up.data.url;
    }
    const res = await createItem({
      name: name.trim(),
      description: description.trim(),
      type,
      version: version.trim() || undefined,
      artworkUrl,
      bannerUrls: banners.filter(Boolean),
      tags: picked,
      sourceUrl: source || undefined,
    });
    setSaving(false);
    if (!res.data) {
      show(res.error ?? "could not publish", "error");
      return;
    }
    show("Submitted for verification.", "success");
    router.replace(`/item/${res.data.id}`);
  };

  if (!profile) {
    return (
      <div className={`bg-app ${styles.page}`}>
        <div className={styles.boot}>
          <Spinner size={22} />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-app ${styles.page}`}>
      <AppTopBar />
      <main className={styles.main}>
        <header className={styles.head}>
          <h1 className={`text-gradient ${styles.title}`}>Drop a build</h1>
          <p className={styles.sub}>Hash it, tag it, and let someone else run it.</p>
        </header>

        <article className={styles.preview}>
          <div
            className={`${styles.art} ${artworkPublic && !artReady ? styles.artFaded : ""} ${artReady ? styles.artHas : ""}`}
            style={artReady ? { backgroundImage: `url(${artworkUrl})` } : undefined}
          >
            <button
              type="button"
              className={styles.artBtn}
              onClick={() => {
                if (!artworkPublic) artFile.current?.click();
              }}
              aria-label="Upload artwork"
            >
              {artworkBusy ? <Spinner size={16} /> : !artReady ? <UploadIcon size={18} className={styles.artIcon} /> : null}
            </button>
          </div>
          <div className={styles.previewId}>
            <p className={styles.previewName}>{previewName}</p>
            <p className={styles.previewUser}>@{profile.username}</p>
          </div>
        </article>
        <input
          ref={artFile}
          className={styles.hidden}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void pickArtwork(f);
            e.target.value = "";
          }}
        />

        <button type="button" className={styles.checkRow} onClick={() => setArtworkPublic((v) => !v)}>
          <span className={`${styles.check} ${artworkPublic ? styles.checkOn : ""}`} aria-hidden>
            <Check size={11} strokeWidth={2.6} />
          </span>
          Use public image url
        </button>
        <div className={`${styles.slide} ${artworkPublic ? styles.slideOpen : ""}`}>
          <div className={styles.slideInner}>
            <div className={styles.field}>
              <input
                className={styles.input}
                value={artworkUrl}
                onChange={(e) => setArtworkUrl(e.target.value)}
                placeholder="https://…"
                inputMode="url"
              />
              {artworkError ? <p className={styles.err}>{artworkError}</p> : null}
            </div>
          </div>
        </div>

        <label className={styles.field}>
          <span className={styles.label}>Name</span>
          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project Name"
            maxLength={80}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Description</span>
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What it does, who it is for, how to run it."
            maxLength={4000}
          />
        </label>

        <div className={styles.row}>
          <div className={styles.field}>
            <span className={styles.label}>Type</span>
            <div className={styles.dropdown} ref={typeRef}>
              <button
                type="button"
                className={styles.selectBtn}
                onClick={() => setTypeOpen((o) => !o)}
                aria-expanded={typeOpen}
              >
                <span className={`${styles.selectVal} ${typeLabel ? "" : styles.selectPh}`}>
                  {typeLabel ?? "Pick a type"}
                </span>
                <ChevronDown size={14} />
              </button>
              {typeOpen ? (
                <div className={styles.menu} role="listbox">
                  {types.map((t) => (
                    <button
                      key={t.slug}
                      type="button"
                      className={`${styles.option} ${type === t.slug ? styles.optionOn : ""}`}
                      onClick={() => {
                        setType(t.slug);
                        setTypeOpen(false);
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>Version</span>
            <div className={styles.version}>
              <input value={version} onChange={(e) => setVersion(e.target.value)} placeholder="1.0.0" />
              <button type="button" className={styles.step} onClick={() => setVersion((v) => bumpVersion(v, 1))} aria-label="Bump version">
                <ChevronUp size={13} />
              </button>
              <button type="button" className={styles.step} onClick={() => setVersion((v) => bumpVersion(v, -1))} aria-label="Lower version">
                <ChevronDown size={13} />
              </button>
            </div>
          </label>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>{galleryLabel}</span>
          <div className={styles.banners}>
            {banners.map((url, i) => (
              <div
                key={`${url}-${i}`}
                className={`${styles.banner} ${isScreenshots ? styles.shot : ""}`}
                style={{ backgroundImage: `url(${url})` }}
              />
            ))}
            {Object.keys(bannerBusy).length > 0 ? (
              <div className={`${styles.banner} ${isScreenshots ? styles.shot : ""}`}>
                <span className={styles.bannerBtn}>
                  <Spinner size={16} />
                </span>
              </div>
            ) : null}
            {!bannerPublic ? (
              <button
                type="button"
                className={`${styles.bannerAdd} ${isScreenshots ? styles.shotAdd : ""}`}
                onClick={() => bannerFile.current?.click()}
                aria-label={isScreenshots ? "Add screenshot" : "Add banner"}
              >
                <PlusIcon size={16} strokeWidth={2.2} />
              </button>
            ) : null}
          </div>
          <input
            ref={bannerFile}
            className={styles.hidden}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void pickBanner(f);
              e.target.value = "";
            }}
          />
          <button type="button" className={styles.checkRow} onClick={() => setBannerPublic((v) => !v)}>
            <span className={`${styles.check} ${bannerPublic ? styles.checkOn : ""}`} aria-hidden>
              <Check size={11} strokeWidth={2.6} />
            </span>
            Use public image urls
          </button>
          <div className={`${styles.slide} ${bannerPublic ? styles.slideOpen : ""}`}>
            <div className={styles.slideInner}>
              <div className={styles.urlStack}>
                {bannerInputs.map((v, i) => (
                  <input
                    key={i}
                    className={styles.input}
                    value={v}
                    onChange={(e) => void applyBannerUrl(i, e.target.value)}
                    placeholder="https://…"
                    inputMode="url"
                  />
                ))}
                {bannerError ? <p className={styles.err}>{bannerError}</p> : null}
                <button
                  type="button"
                  className={styles.plusMini}
                  onClick={() => setBannerInputs((cur) => (cur.length < 8 ? [...cur, ""] : cur))}
                  aria-label="Add another banner url"
                >
                  <PlusIcon size={14} strokeWidth={2.4} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Tags</span>
          <div className={styles.chips}>
            {tags.map((tag) => {
              const on = picked.includes(tag.slug);
              const ripple = ripples[tag.slug];
              return (
                <button
                  key={tag.slug}
                  type="button"
                  className={`${styles.chip} ${on ? styles.chipOn : ""}`}
                  onClick={(e) => toggleTag(tag.slug, e)}
                >
                  {ripple ? (
                    <span className={styles.ripple} style={{ left: ripple.x, top: ripple.y, width: 12, height: 12 }} />
                  ) : null}
                  {tag.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Source</span>
          <div className={`${styles.slide} ${!sourceIsFile ? styles.slideOpen : ""}`}>
            <div className={styles.slideInner}>
              {!sourceIsFile ? (
                <input
                  className={styles.input}
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://github.com/…"
                  inputMode="url"
                />
              ) : null}
            </div>
          </div>
          <div className={`${styles.slide} ${sourceIsFile ? styles.slideOpen : ""}`}>
            <div className={styles.slideInner}>
              {sourceIsFile ? (
                sourceFile ? (
                  <div className={styles.fileChip}>
                    <UploadIcon size={15} />
                    <span className={styles.fileName}>{sourceFile.name}</span>
                    <button type="button" onClick={() => setSourceFile(null)} aria-label="Remove file">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className={`${styles.drop} ${dragOver ? styles.dropOn : ""}`}
                    onClick={() => sourceInput.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      takeSource(e.dataTransfer.files);
                    }}
                  >
                    {sourceBusy ? <Spinner size={16} /> : <UploadIcon size={18} />}
                    <span className={styles.dropTitle}>Click to upload</span>
                    <span className={styles.dropHint}>One file, or a zip. Max {limits?.maxDisplay ?? "50 MB"}.</span>
                  </button>
                )
              ) : null}
            </div>
          </div>
          <input
            ref={sourceInput}
            className={styles.hidden}
            type="file"
            multiple
            onChange={(e) => {
              if (e.target.files) takeSource(e.target.files);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            className={styles.checkRow}
            onClick={() => {
              const next = !sourceIsFile;
              setSourceIsFile(next);
              if (next) notifyZip();
            }}
          >
            <span className={`${styles.check} ${sourceIsFile ? styles.checkOn : ""}`} aria-hidden>
              <Check size={11} strokeWidth={2.6} />
            </span>
            Upload a file instead
          </button>
        </div>

        <button type="button" className={styles.submit} disabled={!canSubmit} onClick={() => void publish()}>
          {saving ? <Spinner size={16} /> : "Publish build"}
        </button>
      </main>

      {dialog ? (
        <div className={styles.dim} onClick={() => setDialog(null)}>
          <div
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dlg-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="dlg-title" className={styles.dialogTitle}>
              {dialog.title}
            </h2>
            <p className={styles.dialogCopy}>{dialog.copy}</p>
            <button type="button" className={styles.dialogOk} onClick={() => setDialog(null)}>
              Got it
            </button>
          </div>
        </div>
      ) : null}

      <Toast toast={toast} onDismiss={dismiss} />
    </div>
  );
}
