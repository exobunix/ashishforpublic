import React, { useState, useEffect } from 'react';
import { useSite } from '@/context/site-context';
import { DEFAULT_CONTENT, NavLink, StatItem, TimelineItem, AboutTimelineEvent, PriorityItem, RoadmapItem, VideoItem, NewsItem, FaqItem, CardItem, PhotoItem } from '@/lib/site-content';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Upload } from 'lucide-react';
import { ImageCropper } from '@/components/image-cropper';

// ─── Reusable form primitives ────────────────────────────────────────────────

async function uploadToImageKit(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const API_URL = import.meta.env.VITE_API_URL || 'https://ashishforpublic.onrender.com';

  const res = await fetch(`${API_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    let errMsg = 'Upload failed';
    try {
      const data = await res.json() as { error?: string; details?: string };
      errMsg = data.details ? `${data.error} (${data.details})` : (data.error || data.details || errMsg);
    } catch {
      try {
        const text = await res.text();
        if (text) errMsg = text;
      } catch {}
    }
    throw new Error(errMsg);
  }

  const data = await res.json() as { url: string };
  return data.url;
}

const LotusIconPreview = () => (
  <svg viewBox="0 0 40 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
    <path d="M20 38C20 38 15 28 15 20C15 14.5 17 11 20 11C23 11 25 14.5 25 20C25 28 20 38 20 38Z" fill="#FF7E54"/>
    <path d="M20 35C20 35 9 27.5 7 18.5C5.5 12.5 8.5 9 12 10C14.5 10.5 16.5 14.5 17.5 19.5C18.5 24.5 20 35 20 35Z" fill="#FF7E54" opacity="0.9"/>
    <path d="M20 35C20 35 31 27.5 33 18.5C34.5 12.5 31.5 9 28 10C25.5 10.5 23.5 14.5 22.5 19.5C21.5 24.5 20 35 20 35Z" fill="#FF7E54" opacity="0.9"/>
    <path d="M20 30C20 30 6 22.5 4 12.5C3 7 6.5 4 10.5 5.5C13.5 7 15.5 13 17 18.5C18.5 24 20 30 20 30Z" fill="#FF7E54" opacity="0.72"/>
    <path d="M20 30C20 30 34 22.5 36 12.5C37 7 33.5 4 29.5 5.5C26.5 7 24.5 13 23 18.5C21.5 24 20 30 20 30Z" fill="#FF7E54" opacity="0.72"/>
    <circle cx="20" cy="20" r="4.5" fill="#FF7E54"/>
  </svg>
);

function ImageUploader({ label, onUploadSuccess, value, btnLabel = 'लोगो बदलें (Upload)' }: {
  label: string;
  onUploadSuccess: (url: string) => void;
  value?: string;
  btnLabel?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [origFileName, setOrigFileName] = useState('');

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOrigFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setCropSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCropComplete = async (croppedFile: File) => {
    setCropSrc(null);
    setUploading(true);
    try {
      const url = await uploadToImageKit(croppedFile);
      onUploadSuccess(url);
    } catch (err: any) {
      console.error(err);
      alert(`Upload error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const isVertical = label.toLowerCase().includes('hero') || label.includes('मुख्य') || label.toLowerCase().includes('about') || label.includes('परिचय');
  const aspectRatio = isVertical ? 0.75 : 1.0;

  return (
    <div className="mb-4 bg-white p-4 border rounded-xl shadow-sm">
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center border overflow-hidden">
          {value ? (
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <LotusIconPreview />
          )}
        </div>
        <label className="flex items-center gap-2 px-4 py-2 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-600 rounded-lg cursor-pointer text-sm font-medium transition-colors">
          <Upload className="w-4 h-4" />
          {uploading ? 'अपलोड हो रहा है...' : btnLabel}
          <input type="file" className="hidden" accept="image/*" onChange={onFileSelect} disabled={uploading} />
        </label>
      </div>
      {cropSrc && (
        <ImageCropper
          imageSrc={cropSrc}
          aspectRatio={aspectRatio}
          fileName={origFileName}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropSrc(null)}
        />
      )}
    </div>
  );
}

function ImageUploadCard({ onUploadSuccess, categories, defaultCategory }: {
  onUploadSuccess: (url: string, title: string, category: string) => void;
  categories: string[];
  defaultCategory: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(defaultCategory);
  
  const [queue, setQueue] = useState<File[]>([]);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [origFileName, setOrigFileName] = useState('');

  // Handle files selection
  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;
    setQueue(prev => [...prev, ...selectedFiles]);
    e.target.value = '';
  };

  // Process queue
  useEffect(() => {
    if (queue.length > 0 && !cropSrc && !uploading) {
      const nextFile = queue[0];
      setOrigFileName(nextFile.name);
      const reader = new FileReader();
      reader.onload = () => {
        setCropSrc(reader.result as string);
      };
      reader.readAsDataURL(nextFile);
    }
  }, [queue, cropSrc, uploading]);

  const handleCropComplete = async (croppedFile: File) => {
    setCropSrc(null);
    setUploading(true);
    try {
      const url = await uploadToImageKit(croppedFile);
      // If user typed a title, use it. Otherwise, use filename without extension.
      const displayTitle = title || origFileName.replace(/\.[^/.]+$/, "");
      onUploadSuccess(url, displayTitle, category);
      
      // Clear manual title input if we finished the entire queue
      if (queue.length <= 1) {
        setTitle('');
      }
    } catch (err: any) {
      console.error(err);
      alert(`Upload error: ${err.message}`);
    } finally {
      setUploading(false);
      setQueue(prev => prev.slice(1));
    }
  };

  const handleCancel = () => {
    setCropSrc(null);
    setQueue(prev => prev.slice(1));
  };

  return (
    <div className="p-4 border border-dashed border-gray-300 rounded-xl bg-orange-50/50 flex flex-col justify-center items-center gap-3 min-h-[220px] shadow-sm relative group">
      {uploading ? (
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="text-xs text-orange-500 font-medium">अपलोड हो रहा है...</span>
          {queue.length > 0 && (
            <span className="text-[10px] text-gray-500">शेष फ़ाइलें: {queue.length}</span>
          )}
        </div>
      ) : (
        <>
          <input
            placeholder="नाम दर्ज करें (वैकल्पिक)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-center"
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full border border-gray-200 rounded px-2 py-1 text-xs bg-white text-center"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <label className="w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center cursor-pointer shadow transition-all duration-300 transform group-hover:scale-105">
            <span className="text-2xl font-bold">+</span>
            <input type="file" className="hidden" accept="image/*" multiple onChange={onFileSelect} />
          </label>
          <span className="text-xs text-gray-500 font-semibold mt-1">
            {queue.length > 0 ? `कतार में: ${queue.length} फोटो` : 'फ़ोटो अपलोड (Bulk)'}
          </span>
        </>
      )}
      {cropSrc && (
        <ImageCropper
          imageSrc={cropSrc}
          aspectRatio={1.0}
          fileName={origFileName}
          onCropComplete={handleCropComplete}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

const F = ({ label, value, onChange, multiline = false, type = 'text' }: {
  label: string; value: string | number; onChange: (v: string) => void;
  multiline?: boolean; type?: string;
}) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-1">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      <span className="text-[10px] text-orange-400/80 font-medium select-none">बोल्ड के लिए: **शब्द**</span>
    </div>
    {multiline ? (
      <textarea
        value={value as string}
        onChange={e => onChange(e.target.value)}
        rows={3}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-y"
      />
    ) : (
      <input
        type={type}
        value={value as string}
        onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
    )}
  </div>
);

const SaveBtn = ({ onClick, saving = false }: { onClick: () => void; saving?: boolean }) => (
  <button
    onClick={onClick}
    disabled={saving}
    className="mt-4 px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-lg transition-colors shadow flex items-center gap-2"
  >
    {saving ? (
      <>
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        सहेज रहा है...
      </>
    ) : (
      '✓ सहेजें'
    )}
  </button>
);

function useAsyncSave(onSave: () => Promise<void>) {
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const save = async () => {
    setSaving(true);
    try {
      await onSave();
      toast({ title: "✓ सहेजा गया", description: "डेटाबेस में सुरक्षित कर दिया गया है।" });
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "⚠️ सहेजने में विफल",
        description: "डेटाबेस से संपर्क नहीं हो सका। कृपया इंटरनेट/IP whitelist जांचें।"
      });
    } finally {
      setSaving(false);
    }
  };
  return { saving, save };
}

// ─── Generic array editor ─────────────────────────────────────────────────────

type AnyItem = Record<string, unknown>;

function ArrayEditor({
  items, onChange, fields, newItem, title,
}: {
  items: AnyItem[]; onChange: (items: AnyItem[]) => void;
  fields: Array<{ key: string; label: string; multiline?: boolean }>;
  newItem: AnyItem; title: string;
}) {
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [draft, setDraft] = useState<AnyItem>({ ...newItem });

  const update = (idx: number, key: string, val: string) => {
    const next = items.map((item, i) => i === idx ? { ...item, [key]: val } : item);
    onChange(next);
  };
  const remove = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
    if (editIdx === idx) setEditIdx(null);
  };
  const add = () => {
    onChange([...items, { ...draft }]);
    setDraft({ ...newItem });
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-gray-50 px-4 py-2 flex justify-between items-center border-b">
        <span className="font-semibold text-sm text-gray-700">{title}</span>
        <span className="text-xs text-gray-400">{items.length} आइटम</span>
      </div>
      <div className="divide-y">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm font-medium text-gray-700 truncate max-w-[60%]">
                {String(Object.values(item)[0] || `आइटम ${idx + 1}`)}
              </span>
              <div className="flex gap-2">
                <button onClick={() => setEditIdx(editIdx === idx ? null : idx)}
                  className="text-xs px-3 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100">
                  {editIdx === idx ? 'बंद' : 'संपादित'}
                </button>
                <button onClick={() => remove(idx)}
                  className="text-xs px-3 py-1 rounded bg-red-50 text-red-500 hover:bg-red-100">
                  हटाएं
                </button>
              </div>
            </div>
            {editIdx === idx && (
              <div className="px-4 pb-4 bg-gray-50 border-t">
                {fields.map(f => (
                  <div key={String(f.key)} className="mt-3">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                    {f.multiline ? (
                      <textarea
                        value={String(item[f.key] ?? '')}
                        onChange={e => update(idx, f.key, e.target.value)}
                        rows={2}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400 resize-y"
                      />
                    ) : (
                      <input
                        value={String(item[f.key] ?? '')}
                        onChange={e => update(idx, f.key, e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Add new */}
      <div className="bg-orange-50 border-t px-4 py-3">
        <p className="text-xs font-semibold text-gray-600 mb-2">नया आइटम जोड़ें</p>
        {fields.map(f => (
          <div key={String(f.key)} className="mb-2">
            <input
              placeholder={f.label}
              value={String(draft[f.key] ?? '')}
              onChange={e => setDraft(p => ({ ...p, [f.key]: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
            />
          </div>
        ))}
        <button onClick={add}
          className="mt-1 px-4 py-1.5 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition-colors">
          + जोड़ें
        </button>
      </div>
    </div>
  );
}

// String array editor (for simple string lists)
function StringListEditor({ items, onChange, title, placeholder }: {
  items: string[]; onChange: (items: string[]) => void; title: string; placeholder?: string;
}) {
  const [newVal, setNewVal] = useState('');
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
      <div className="bg-gray-50 px-4 py-2 border-b flex justify-between">
        <span className="font-semibold text-sm text-gray-700">{title}</span>
        <span className="text-xs text-gray-400">{items.length} आइटम</span>
      </div>
      <div className="divide-y bg-white">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 px-4 py-2">
            <input
              value={item}
              onChange={e => onChange(items.map((v, i) => i === idx ? e.target.value : v))}
              className="flex-1 border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
            />
            <button onClick={() => onChange(items.filter((_, i) => i !== idx))}
              className="text-xs px-2 py-1 rounded bg-red-50 text-red-500 hover:bg-red-100">✕</button>
          </div>
        ))}
      </div>
      <div className="bg-orange-50 border-t px-4 py-3 flex gap-2">
        <input
          value={newVal}
          onChange={e => setNewVal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && newVal) { onChange([...items, newVal]); setNewVal(''); } }}
          placeholder={placeholder || 'नया आइटम...'}
          className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
        />
        <button onClick={() => { if (newVal) { onChange([...items, newVal]); setNewVal(''); } }}
          className="px-4 py-1.5 bg-orange-500 text-white text-sm rounded hover:bg-orange-600">+ जोड़ें</button>
      </div>
    </div>
  );
}

// ─── Section form components ──────────────────────────────────────────────────

function GeneralSection({ setDirty }: { setDirty: (d: boolean) => void }) {
  const { content, update } = useSite();
  const [form, setForm] = useState({ logoUrl: '', ...content.general });
  useEffect(() => { setForm({ logoUrl: '', ...content.general }); }, [content.general]);
  const set = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }));
  const { saving, save } = useAsyncSave(() => update({ general: form }));

  const isDirty = JSON.stringify(form) !== JSON.stringify({ logoUrl: '', ...content.general });
  useEffect(() => {
    setDirty(isDirty);
    return () => setDirty(false);
  }, [isDirty, setDirty]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-gray-800">⚙️ सामान्य सेटिंग्स</h2>
      <ImageUploader label="वेबसाइट लोगो (Logo)" value={form.logoUrl} onUploadSuccess={url => setForm(p => ({ ...p, logoUrl: url }))} />
      <F label="साइट का नाम (हेडर में दिखेगा)" value={form.siteName} onChange={set('siteName')} />
      <F label="मुख्य नारा / Tagline" value={form.tagline} onChange={set('tagline')} />
      <F label="नेविगेशन CTA बटन लेबल" value={form.navCtaLabel} onChange={set('navCtaLabel')} />
      <SaveBtn onClick={save} saving={saving} />
    </div>
  );
}

function NavigationSection({ setDirty }: { setDirty: (d: boolean) => void }) {
  const { content, update } = useSite();
  const [links, setLinks] = useState<NavLink[]>(content.nav.links.map(l => ({ ...l })));
  useEffect(() => { setLinks(content.nav.links.map(l => ({ ...l }))); }, [content.nav.links]);
  const { saving, save } = useAsyncSave(() => update({ nav: { links } }));

  const isDirty = JSON.stringify(links) !== JSON.stringify(content.nav.links);
  useEffect(() => {
    setDirty(isDirty);
    return () => setDirty(false);
  }, [isDirty, setDirty]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-gray-800">📋 नेविगेशन मेनू</h2>
      <p className="text-sm text-gray-500 mb-4">हेडर में दिखने वाले मेनू लिंक संपादित करें।</p>
      <ArrayEditor
        items={links as unknown as AnyItem[]}
        onChange={items => setLinks(items as unknown as NavLink[])}
        fields={[
          { key: 'name', label: 'मेनू नाम' },
          { key: 'path', label: 'पेज पाथ (/ /about आदि)' },
        ]}
        newItem={{ name: '', path: '/' }}
        title="नेविगेशन लिंक"
      />
      <SaveBtn onClick={save} saving={saving} />
    </div>
  );
}

function WhatsAppSection({ setDirty }: { setDirty: (d: boolean) => void }) {
  const { content, update } = useSite();
  const [form, setForm] = useState({ number: content.whatsapp.number, enabled: content.whatsapp.enabled });
  useEffect(() => { setForm({ number: content.whatsapp.number, enabled: content.whatsapp.enabled }); }, [content.whatsapp]);
  const { saving, save } = useAsyncSave(() => update({ whatsapp: form }));

  const isDirty = JSON.stringify(form) !== JSON.stringify({ number: content.whatsapp.number, enabled: content.whatsapp.enabled });
  useEffect(() => {
    setDirty(isDirty);
    return () => setDirty(false);
  }, [isDirty, setDirty]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-gray-800">💬 WhatsApp सेटिंग्स</h2>
      <F label="WhatsApp नंबर (देश कोड के साथ, जैसे 919415050717)" value={form.number} onChange={v => setForm(p => ({ ...p, number: v }))} />
      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm font-semibold text-gray-700">WhatsApp बटन दिखाएं</label>
        <button onClick={() => setForm(p => ({ ...p, enabled: !p.enabled }))}
          className={`relative w-12 h-6 rounded-full transition-colors ${form.enabled ? 'bg-green-500' : 'bg-gray-300'}`}>
          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.enabled ? 'left-7' : 'left-1'}`} />
        </button>
        <span className="text-sm text-gray-500">{form.enabled ? 'चालू' : 'बंद'}</span>
      </div>
      <SaveBtn onClick={save} saving={saving} />
    </div>
  );
}

function SocialSection({ setDirty }: { setDirty: (d: boolean) => void }) {
  const { content, update } = useSite();
  const [form, setForm] = useState({ ...content.socialMedia });
  useEffect(() => { setForm({ ...content.socialMedia }); }, [content.socialMedia]);
  const set = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }));
  const { saving, save } = useAsyncSave(() => update({ socialMedia: form }));

  const isDirty = JSON.stringify(form) !== JSON.stringify(content.socialMedia);
  useEffect(() => {
    setDirty(isDirty);
    return () => setDirty(false);
  }, [isDirty, setDirty]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-gray-800">📱 सोशल मीडिया लिंक</h2>
      <F label="Facebook URL" value={form.facebook} onChange={set('facebook')} />
      <F label="Twitter/X URL" value={form.twitter} onChange={set('twitter')} />
      <F label="Instagram URL" value={form.instagram} onChange={set('instagram')} />
      <SaveBtn onClick={save} saving={saving} />
    </div>
  );
}

function ContactInfoSection({ setDirty }: { setDirty: (d: boolean) => void }) {
  const { content, update } = useSite();
  const [form, setForm] = useState({ ...content.contactInfo });
  useEffect(() => { setForm({ ...content.contactInfo }); }, [content.contactInfo]);
  const set = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }));
  const { saving, save } = useAsyncSave(() => update({ contactInfo: form }));

  const isDirty = JSON.stringify(form) !== JSON.stringify(content.contactInfo);
  useEffect(() => {
    setDirty(isDirty);
    return () => setDirty(false);
  }, [isDirty, setDirty]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-gray-800">📞 संपर्क जानकारी</h2>
      <F label="कार्यालय का पता" value={form.address} onChange={set('address')} multiline />
      <F label="फोन नंबर 1 (कार्यालय)" value={form.phone1} onChange={set('phone1')} />
      <F label="फोन नंबर 2 (WhatsApp)" value={form.phone2} onChange={set('phone2')} />
      <F label="ईमेल पता" value={form.email} onChange={set('email')} />
      <F label="वेबसाइट" value={form.website} onChange={set('website')} />
      <SaveBtn onClick={save} saving={saving} />
    </div>
  );
}

function HeroSection({ setDirty }: { setDirty: (d: boolean) => void }) {
  const { content, update } = useSite();
  const [form, setForm] = useState({ ...content.hero });
  useEffect(() => { setForm({ ...content.hero }); }, [content.hero]);
  const set = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }));
  const { saving, save } = useAsyncSave(() => update({ hero: form }));

  const isDirty = JSON.stringify(form) !== JSON.stringify(content.hero);
  useEffect(() => {
    setDirty(isDirty);
    return () => setDirty(false);
  }, [isDirty, setDirty]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-gray-800">🏠 होम पेज — हीरो सेक्शन</h2>
      <F label="पार्टी बैज टेक्स्ट" value={form.partyBadge} onChange={set('partyBadge')} />
      <F label="मुख्य शीर्षक" value={form.headline} onChange={set('headline')} />
      <F label="उप-शीर्षक" value={form.subheading} onChange={set('subheading')} />
      <F label="उद्धरण / Quote" value={form.quote} onChange={set('quote')} />
      <F label="CTA बटन 1 (मेरे बारे में)" value={form.cta1} onChange={set('cta1')} />
      <F label="CTA बटन 2 (जनसंपर्क)" value={form.cta2} onChange={set('cta2')} />
      <F label="CTA बटन 3 (विज़न)" value={form.cta3} onChange={set('cta3')} />
      <F label="फ्लोटिंग बैज शीर्षक" value={form.floatingBadgeTitle} onChange={set('floatingBadgeTitle')} />
      <F label="फ्लोटिंग बैज सब-टेक्स्ट" value={form.floatingBadgeSub} onChange={set('floatingBadgeSub')} />
      <ImageUploader
        label="मुख्य फोटो (Hero Photo)"
        value={form.profileImage}
        onUploadSuccess={url => setForm(p => ({ ...p, profileImage: url }))}
        btnLabel="फोटो बदलें (Upload)"
      />
      <SaveBtn onClick={save} saving={saving} />
    </div>
  );
}

function StatsSection({ setDirty }: { setDirty: (d: boolean) => void }) {
  const { content, update } = useSite();
  const [stats, setStats] = useState<StatItem[]>(content.stats.map(s => ({ ...s })));
  useEffect(() => { setStats(content.stats.map(s => ({ ...s }))); }, [content.stats]);
  const { saving, save } = useAsyncSave(() => update({ stats }));

  const isDirty = JSON.stringify(stats) !== JSON.stringify(content.stats);
  useEffect(() => {
    setDirty(isDirty);
    return () => setDirty(false);
  }, [isDirty, setDirty]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-gray-800">📊 होम पेज — आंकड़े / Statistics</h2>
      {stats.map((s, i) => (
        <div key={i} className="mb-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
          <p className="text-sm font-bold text-gray-600 mb-3">आंकड़ा {i + 1}</p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">लेबल</label>
              <input value={s.label} onChange={e => setStats(prev => prev.map((x, j) => j === i ? { ...x, label: e.target.value } : x))}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">मान (संख्या)</label>
              <input type="number" value={s.value} onChange={e => setStats(prev => prev.map((x, j) => j === i ? { ...x, value: Number(e.target.value) } : x))}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">प्रत्यय (जैसे +)</label>
              <input value={s.suffix} onChange={e => setStats(prev => prev.map((x, j) => j === i ? { ...x, suffix: e.target.value } : x))}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400" />
            </div>
          </div>
        </div>
      ))}
      <SaveBtn onClick={save} saving={saving} />
    </div>
  );
}

function MissionSection({ setDirty }: { setDirty: (d: boolean) => void }) {
  const { content, update } = useSite();
  const [form, setForm] = useState({ ...content.mission });
  useEffect(() => { setForm({ ...content.mission }); }, [content.mission]);
  const set = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }));
  const { saving, save } = useAsyncSave(() => update({ mission: form }));

  const isDirty = JSON.stringify(form) !== JSON.stringify(content.mission);
  useEffect(() => {
    setDirty(isDirty);
    return () => setDirty(false);
  }, [isDirty, setDirty]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-gray-800">🎯 होम पेज — मिशन सेक्शन</h2>
      <F label="सेक्शन लेबल (छोटा)" value={form.sectionLabel} onChange={set('sectionLabel')} />
      <F label="मुख्य शीर्षक" value={form.heading} onChange={set('heading')} />
      <F label="विवरण" value={form.description} onChange={set('description')} multiline />
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-3">3 मुख्य कार्ड</p>
        {form.cards.map((c, i) => (
          <div key={i} className="mb-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
            <F label={`कार्ड ${i + 1} — शीर्षक`} value={c.title}
              onChange={v => setForm(p => ({ ...p, cards: p.cards.map((x, j) => j === i ? { ...x, title: v } : x) }))} />
            <F label={`कार्ड ${i + 1} — विवरण`} value={c.desc}
              onChange={v => setForm(p => ({ ...p, cards: p.cards.map((x, j) => j === i ? { ...x, desc: v } : x) }))} multiline />
          </div>
        ))}
      </div>
      <StringListEditor items={form.coreValues} onChange={v => setForm(p => ({ ...p, coreValues: v }))}
        title="मूल मूल्य (Core Values)" placeholder="नया मूल्य..." />
      <SaveBtn onClick={save} saving={saving} />
    </div>
  );
}

function HomeTimelineSection({ setDirty }: { setDirty: (d: boolean) => void }) {
  const { content, update } = useSite();
  const [form, setForm] = useState({ ...content.homeTimeline, items: content.homeTimeline.items.map(i => ({ ...i })) });
  useEffect(() => { setForm({ ...content.homeTimeline, items: content.homeTimeline.items.map(i => ({ ...i })) }); }, [content.homeTimeline]);
  const { saving, save } = useAsyncSave(() => update({ homeTimeline: form }));

  const isDirty = JSON.stringify(form) !== JSON.stringify({ ...content.homeTimeline, items: content.homeTimeline.items });
  useEffect(() => {
    setDirty(isDirty);
    return () => setDirty(false);
  }, [isDirty, setDirty]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-gray-800">📅 होम पेज — राजनीतिक यात्रा</h2>
      <F label="सेक्शन शीर्षक" value={form.heading} onChange={v => setForm(p => ({ ...p, heading: v }))} />
      <F label="उप-शीर्षक" value={form.subheading} onChange={v => setForm(p => ({ ...p, subheading: v }))} />
      <F label="CTA बटन लेबल" value={form.ctaLabel} onChange={v => setForm(p => ({ ...p, ctaLabel: v }))} />
      <ArrayEditor
        items={form.items as unknown as AnyItem[]}
        onChange={items => setForm(p => ({ ...p, items: items as unknown as TimelineItem[] }))}
        fields={[
          { key: 'year', label: 'वर्ष' },
          { key: 'title', label: 'घटना का शीर्षक' },
          { key: 'role', label: 'भूमिका / विवरण' },
        ]}
        newItem={{ year: '', title: '', role: '' }}
        title="टाइमलाइन आइटम"
      />
      <SaveBtn onClick={save} saving={saving} />
    </div>
  );
}

function QuoteJoinSection({ setDirty }: { setDirty: (d: boolean) => void }) {
  const { content, update } = useSite();
  const [quote, setQuote] = useState(content.quoteBanner);
  const [join, setJoin] = useState({ ...content.joinSection });
  useEffect(() => { setQuote(content.quoteBanner); setJoin({ ...content.joinSection }); }, [content.quoteBanner, content.joinSection]);
  const { saving, save } = useAsyncSave(() => update({ quoteBanner: quote, joinSection: join }));

  const isDirty = quote !== content.quoteBanner || JSON.stringify(join) !== JSON.stringify(content.joinSection);
  useEffect(() => {
    setDirty(isDirty);
    return () => setDirty(false);
  }, [isDirty, setDirty]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-gray-800">💭 होम पेज — उद्धरण और जुड़ें</h2>
      <F label="प्रेरणा उद्धरण (बैनर)" value={quote} onChange={setQuote} multiline />
      <div className="mt-6 pt-6 border-t">
        <p className="font-semibold text-gray-700 mb-3">जुड़ें सेक्शन</p>
        <F label="शीर्षक" value={join.heading} onChange={v => setJoin(p => ({ ...p, heading: v }))} />
        <F label="विवरण" value={join.description} onChange={v => setJoin(p => ({ ...p, description: v }))} multiline />
        <F label="बटन लेबल" value={join.ctaLabel} onChange={v => setJoin(p => ({ ...p, ctaLabel: v }))} />
      </div>
      <SaveBtn onClick={save} saving={saving} />
    </div>
  );
}

function AboutSection({ setDirty }: { setDirty: (d: boolean) => void }) {
  const { content, update } = useSite();
  const [form, setForm] = useState({ ...content.about, timelineEvents: content.about.timelineEvents.map(e => ({ ...e })), philosophyCards: content.about.philosophyCards.map(c => ({ ...c })) });
  useEffect(() => { setForm({ ...content.about, timelineEvents: content.about.timelineEvents.map(e => ({ ...e })), philosophyCards: content.about.philosophyCards.map(c => ({ ...c })) }); }, [content.about]);
  const { saving, save } = useAsyncSave(() => update({ about: form }));

  const isDirty = JSON.stringify(form) !== JSON.stringify({ ...content.about, timelineEvents: content.about.timelineEvents, philosophyCards: content.about.philosophyCards });
  useEffect(() => {
    setDirty(isDirty);
    return () => setDirty(false);
  }, [isDirty, setDirty]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-gray-800">👤 परिचय पेज</h2>
      <F label="पेज शीर्षक" value={form.heroHeading} onChange={v => setForm(p => ({ ...p, heroHeading: v }))} />
      <F label="उप-शीर्षक" value={form.heroSubtitle} onChange={v => setForm(p => ({ ...p, heroSubtitle: v }))} />
      <div className="my-6 pt-4 border-t">
        <p className="font-semibold text-gray-700 mb-3">हमारे बारे में (About Us)</p>
        <F label="शीर्षक (Heading)" value={form.aboutUsHeading || ''} onChange={v => setForm(p => ({ ...p, aboutUsHeading: v }))} />
        <F label="विवरण (Content)" value={form.aboutUsContent || ''} onChange={v => setForm(p => ({ ...p, aboutUsContent: v }))} multiline />
      </div>
      <div className="my-6 pt-4 border-t">
        <p className="font-semibold text-gray-700 mb-3">व्यक्तिगत जानकारी</p>
        <ImageUploader
          label="परिचय फोटो (About Image)"
          value={form.profileImage}
          onUploadSuccess={url => setForm(p => ({ ...p, profileImage: url }))}
          btnLabel="फोटो बदलें (Upload)"
        />
        <F label="नाम" value={form.personalName} onChange={v => setForm(p => ({ ...p, personalName: v }))} />
        <F label="पिता का नाम" value={form.personalFather} onChange={v => setForm(p => ({ ...p, personalFather: v }))} />
        <F label="जन्म तिथि" value={form.personalBirth} onChange={v => setForm(p => ({ ...p, personalBirth: v }))} />
        <F label="शिक्षा" value={form.personalEducation} onChange={v => setForm(p => ({ ...p, personalEducation: v }))} />
        <F label="BJP सदस्यता नंबर" value={form.personalMembership} onChange={v => setForm(p => ({ ...p, personalMembership: v }))} />
      </div>
      <div className="my-6 pt-4 border-t">
        <p className="font-semibold text-gray-700 mb-3">दर्शन कार्ड (Vision / Values / Mission)</p>
        {form.philosophyCards.map((c, i) => (
          <div key={i} className="mb-4 p-4 border rounded-xl bg-gray-50">
            <F label={`कार्ड ${i + 1} — शीर्षक`} value={c.title}
              onChange={v => setForm(p => ({ ...p, philosophyCards: p.philosophyCards.map((x, j) => j === i ? { ...x, title: v } : x) }))} />
            <F label={`कार्ड ${i + 1} — विवरण`} value={c.desc}
              onChange={v => setForm(p => ({ ...p, philosophyCards: p.philosophyCards.map((x, j) => j === i ? { ...x, desc: v } : x) }))} multiline />
          </div>
        ))}
      </div>
      <div className="my-6 pt-4 border-t">
        <p className="font-semibold text-gray-700 mb-3">जीवन यात्रा (टाइमलाइन)</p>
        <ArrayEditor
          items={form.timelineEvents as unknown as AnyItem[]}
          onChange={items => setForm(p => ({ ...p, timelineEvents: items as unknown as AboutTimelineEvent[] }))}
          fields={[
            { key: 'year', label: 'वर्ष' },
            { key: 'title', label: 'शीर्षक' },
            { key: 'desc', label: 'विवरण', multiline: true },
          ]}
          newItem={{ year: '', title: '', desc: '' }}
          title="जीवन यात्रा आइटम"
        />
      </div>
      <F label="प्रेरणा उद्धरण (पेज के अंत में)" value={form.inspirationQuote} onChange={v => setForm(p => ({ ...p, inspirationQuote: v }))} multiline />
      <SaveBtn onClick={save} saving={saving} />
    </div>
  );
}

function VisionSection({ setDirty }: { setDirty: (d: boolean) => void }) {
  const { content, update } = useSite();
  const [form, setForm] = useState({
    ...content.vision,
    priorities: content.vision.priorities.map(p => ({ ...p })),
    roadmap: content.vision.roadmap.map(r => ({ ...r })),
    achievements: [...content.vision.achievements],
    pledges: [...content.vision.pledges],
  });
  useEffect(() => {
    setForm({ ...content.vision, priorities: content.vision.priorities.map(p => ({ ...p })), roadmap: content.vision.roadmap.map(r => ({ ...r })), achievements: [...content.vision.achievements], pledges: [...content.vision.pledges] });
  }, [content.vision]);
  const { saving, save } = useAsyncSave(() => update({ vision: form }));

  const isDirty = JSON.stringify(form) !== JSON.stringify({ ...content.vision, priorities: content.vision.priorities, roadmap: content.vision.roadmap, achievements: content.vision.achievements, pledges: content.vision.pledges });
  useEffect(() => {
    setDirty(isDirty);
    return () => setDirty(false);
  }, [isDirty, setDirty]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-gray-800">👁️ दृष्टिकोण पेज</h2>
      <F label="पेज शीर्षक" value={form.heroHeading} onChange={v => setForm(p => ({ ...p, heroHeading: v }))} />
      <F label="उप-शीर्षक" value={form.heroSubtitle} onChange={v => setForm(p => ({ ...p, heroSubtitle: v }))} />
      <F label="प्राथमिकताएं शीर्षक" value={form.prioritiesHeading} onChange={v => setForm(p => ({ ...p, prioritiesHeading: v }))} />
      <div className="mt-6 pt-4 border-t">
        <ArrayEditor
          items={form.priorities as unknown as AnyItem[]}
          onChange={items => setForm(p => ({ ...p, priorities: items as unknown as PriorityItem[] }))}
          fields={[
            { key: 'title', label: 'शीर्षक' },
            { key: 'desc', label: 'विवरण', multiline: true },
          ]}
          newItem={{ title: '', desc: '' }}
          title="प्रमुख प्राथमिकताएं"
        />
      </div>
      <div className="mt-6 pt-4 border-t">
        <F label="रोडमैप शीर्षक" value={form.roadmapHeading} onChange={v => setForm(p => ({ ...p, roadmapHeading: v }))} />
        <ArrayEditor
          items={form.roadmap as unknown as AnyItem[]}
          onChange={items => setForm(p => ({ ...p, roadmap: items as unknown as RoadmapItem[] }))}
          fields={[
            { key: 'phase', label: 'चरण' },
            { key: 'title', label: 'शीर्षक' },
            { key: 'desc', label: 'विवरण', multiline: true },
          ]}
          newItem={{ phase: '', title: '', desc: '' }}
          title="विकास रोडमैप चरण"
        />
      </div>
      <div className="mt-6 pt-4 border-t">
        <F label="उपलब्धियां शीर्षक" value={form.achievementsHeading} onChange={v => setForm(p => ({ ...p, achievementsHeading: v }))} />
        <StringListEditor items={form.achievements} onChange={v => setForm(p => ({ ...p, achievements: v }))} title="सामाजिक उपलब्धियां" placeholder="नई उपलब्धि..." />
      </div>
      <div className="mt-6 pt-4 border-t">
        <F label="संकल्प शीर्षक" value={form.pledgeHeading} onChange={v => setForm(p => ({ ...p, pledgeHeading: v }))} />
        <StringListEditor items={form.pledges} onChange={v => setForm(p => ({ ...p, pledges: v }))} title="संकल्प सूची" placeholder="नया संकल्प..." />
      </div>
      <F label="मिशन स्टेटमेंट" value={form.missionStatement} onChange={v => setForm(p => ({ ...p, missionStatement: v }))} multiline />
      <SaveBtn onClick={save} saving={saving} />
    </div>
  );
}

function MediaSection({ setDirty }: { setDirty: (d: boolean) => void }) {
  const { content, update } = useSite();
  const defaultPhotos = DEFAULT_CONTENT.media.photos || [];

  const [form, setForm] = useState({
    ...content.media,
    categories: [...content.media.categories],
    photos: content.media.photos && content.media.photos.length > 0
      ? content.media.photos.map(p => ({ ...p }))
      : defaultPhotos.map(p => ({ ...p })),
    videos: content.media.videos.map(v => ({ ...v })),
    news: content.media.news.map(n => ({ ...n })),
  });

  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoCategory, setNewPhotoCategory] = useState(content.media.categories[0] || 'सभी');

  // Cropper states for existing photos edit
  const [activeCropIdx, setActiveCropIdx] = useState<number | null>(null);
  const [activeCropSrc, setActiveCropSrc] = useState<string | null>(null);
  const [activeCropFileName, setActiveCropFileName] = useState('');

  useEffect(() => {
    setForm({
      ...content.media,
      categories: [...content.media.categories],
      photos: content.media.photos && content.media.photos.length > 0
        ? content.media.photos.map(p => ({ ...p }))
        : defaultPhotos.map(p => ({ ...p })),
      videos: content.media.videos.map(v => ({ ...v })),
      news: content.media.news.map(n => ({ ...n }))
    });
  }, [content.media]);

  const { saving, save } = useAsyncSave(() => update({ media: form }));

  const isDirty = JSON.stringify(form) !== JSON.stringify({
    ...content.media,
    categories: content.media.categories,
    photos: content.media.photos && content.media.photos.length > 0
      ? content.media.photos
      : defaultPhotos,
    videos: content.media.videos,
    news: content.media.news
  });
  useEffect(() => {
    setDirty(isDirty);
    return () => setDirty(false);
  }, [isDirty, setDirty]);
  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-gray-800">📸 मीडिया पेज</h2>
      <F label="पेज शीर्षक" value={form.heroHeading} onChange={v => setForm(p => ({ ...p, heroHeading: v }))} />
      <F label="उप-शीर्षक" value={form.heroSubtitle} onChange={v => setForm(p => ({ ...p, heroSubtitle: v }))} />
      <F label="फोटो सेक्शन शीर्षक" value={form.photoHeading} onChange={v => setForm(p => ({ ...p, photoHeading: v }))} />
      <StringListEditor items={form.categories} onChange={v => setForm(p => ({ ...p, categories: v }))} title="फोटो गैलरी श्रेणियां" placeholder="नई श्रेणी..." />

      <div className="mt-6 pt-4 border-t">
        <p className="font-semibold text-gray-700 mb-3">फोटो गैलरी (Photos)</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {form.photos?.map((photo, idx) => (
            <div key={photo.id} className="p-4 border rounded-xl bg-white flex flex-col gap-2 shadow-sm min-h-[220px]">
              {photo.url ? (
                <img src={photo.url} alt={photo.title} className="w-full h-24 object-cover rounded" />
              ) : (
                <div className="w-full h-24 bg-gray-50 border border-dashed rounded flex items-center justify-center text-gray-400 text-xs font-medium">
                  कोई फोटो नहीं
                </div>
              )}
              
              <label className="w-full py-1 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-600 rounded text-center text-xs font-semibold cursor-pointer transition-colors block">
                फोटो बदलें (Upload)
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setActiveCropIdx(idx);
                    setActiveCropFileName(file.name);
                    const reader = new FileReader();
                    reader.onload = () => {
                      setActiveCropSrc(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                    e.target.value = '';
                  }}
                />
              </label>

              <input
                value={photo.title}
                onChange={e => setForm(p => ({
                  ...p,
                  photos: p.photos?.map((ph, i) => i === idx ? { ...ph, title: e.target.value } : ph)
                }))}
                className="w-full border border-gray-200 rounded px-2 py-1 text-xs"
                placeholder="फोटो का नाम (Rename)"
              />
              <select
                value={photo.category}
                onChange={e => setForm(p => ({
                  ...p,
                  photos: p.photos?.map((ph, i) => i === idx ? { ...ph, category: e.target.value } : ph)
                }))}
                className="w-full border border-gray-200 rounded px-2 py-1 text-xs bg-white"
              >
                {form.categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button
                onClick={() => setForm(p => ({
                  ...p,
                  photos: p.photos?.filter((_, i) => i !== idx)
                }))}
                className="w-full py-1 bg-red-50 text-red-500 hover:bg-red-100 rounded text-xs font-semibold transition-colors mt-auto"
              >
                हटाएं
              </button>
            </div>
          ))}
          <ImageUploadCard
            categories={form.categories}
            defaultCategory={form.categories[0] || 'सभी'}
            onUploadSuccess={(url, title, category) => {
              const newPhoto: PhotoItem = {
                id: String(Date.now()),
                title,
                category,
                url
              };
              setForm(p => ({ ...p, photos: [...(p.photos || []), newPhoto] }));
            }}
          />
        </div>
      </div>

      {activeCropSrc && activeCropIdx !== null && (
        <ImageCropper
          imageSrc={activeCropSrc}
          aspectRatio={1.0}
          fileName={activeCropFileName}
          onCancel={() => {
            setActiveCropSrc(null);
            setActiveCropIdx(null);
          }}
          onCropComplete={async (croppedFile) => {
            const idx = activeCropIdx;
            setActiveCropSrc(null);
            setActiveCropIdx(null);
            try {
              const url = await uploadToImageKit(croppedFile);
              setForm(p => ({
                ...p,
                photos: p.photos?.map((ph, i) => i === idx ? { ...ph, url } : ph)
              }));
            } catch (err: any) {
              alert(`Upload error: ${err.message}`);
            }
          }}
        />
      )}

      <div className="mt-6 pt-4 border-t">
        <F label="वीडियो सेक्शन शीर्षक" value={form.videoHeading} onChange={v => setForm(p => ({ ...p, videoHeading: v }))} />
        <ArrayEditor
          items={form.videos as unknown as AnyItem[]}
          onChange={items => setForm(p => ({ ...p, videos: items as unknown as VideoItem[] }))}
          fields={[
            { key: 'title', label: 'वीडियो शीर्षक' },
            { key: 'embedUrl', label: 'YouTube Embed URL (खाली छोड़ें प्लेसहोल्डर के लिए)' },
          ]}
          newItem={{ title: '', embedUrl: '' }}
          title="वीडियो"
        />
      </div>
      <div className="mt-6 pt-4 border-t">
        <F label="समाचार सेक्शन शीर्षक" value={form.newsHeading} onChange={v => setForm(p => ({ ...p, newsHeading: v }))} />
        <ArrayEditor
          items={form.news as unknown as AnyItem[]}
          onChange={items => setForm(p => ({ ...p, news: items as unknown as NewsItem[] }))}
          fields={[
            { key: 'date', label: 'तारीख' },
            { key: 'title', label: 'समाचार शीर्षक', multiline: true },
            { key: 'source', label: 'स्रोत (अखबार का नाम)' },
          ]}
          newItem={{ date: '', title: '', source: '' }}
          title="समाचार / प्रेस"
        />
      </div>
      <SaveBtn onClick={save} saving={saving} />
    </div>
  );
}

function ContactPageSection({ setDirty }: { setDirty: (d: boolean) => void }) {
  const { content, update } = useSite();
  const [form, setForm] = useState({
    ...content.contactPage,
    faqs: content.contactPage.faqs.map(f => ({ ...f })),
  });
  useEffect(() => {
    setForm({ ...content.contactPage, faqs: content.contactPage.faqs.map(f => ({ ...f })) });
  }, [content.contactPage]);
  const { saving, save } = useAsyncSave(() => update({ contactPage: form }));

  const isDirty = JSON.stringify(form) !== JSON.stringify({ ...content.contactPage, faqs: content.contactPage.faqs });
  useEffect(() => {
    setDirty(isDirty);
    return () => setDirty(false);
  }, [isDirty, setDirty]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-gray-800">📩 संपर्क पेज</h2>
      <F label="पेज शीर्षक" value={form.heroHeading} onChange={v => setForm(p => ({ ...p, heroHeading: v }))} />
      <F label="उप-शीर्षक" value={form.heroSubtitle} onChange={v => setForm(p => ({ ...p, heroSubtitle: v }))} />
      <div className="mt-4 pt-4 border-t">
        <p className="font-semibold text-gray-700 mb-3">कार्यालय समय</p>
        <F label="कार्यालय घंटे" value={form.officeHours} onChange={v => setForm(p => ({ ...p, officeHours: v }))} />
        <F label="रविवार / विशेष घंटे" value={form.sundayHours} onChange={v => setForm(p => ({ ...p, sundayHours: v }))} />
      </div>
      <div className="mt-4 pt-4 border-t">
        <p className="font-semibold text-gray-700 mb-3">स्वयंसेवक सेक्शन</p>
        <F label="शीर्षक" value={form.volunteerHeading} onChange={v => setForm(p => ({ ...p, volunteerHeading: v }))} />
        <F label="विवरण" value={form.volunteerDesc} onChange={v => setForm(p => ({ ...p, volunteerDesc: v }))} multiline />
      </div>
      <div className="mt-6 pt-4 border-t">
        <F label="FAQ सेक्शन शीर्षक" value={form.faqHeading} onChange={v => setForm(p => ({ ...p, faqHeading: v }))} />
        <ArrayEditor
          items={form.faqs as unknown as AnyItem[]}
          onChange={items => setForm(p => ({ ...p, faqs: items as unknown as FaqItem[] }))}
          fields={[
            { key: 'q', label: 'प्रश्न' },
            { key: 'a', label: 'उत्तर', multiline: true },
          ]}
          newItem={{ q: '', a: '' }}
          title="FAQ प्रश्नोत्तर"
        />
      </div>
      <SaveBtn onClick={save} saving={saving} />
    </div>
  );
}

function FooterSection({ setDirty }: { setDirty: (d: boolean) => void }) {
  const { content, update } = useSite();
  const [form, setForm] = useState({ ...content.footer });
  useEffect(() => { setForm({ ...content.footer }); }, [content.footer]);
  const set = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }));
  const { saving, save } = useAsyncSave(() => update({ footer: form }));

  const isDirty = JSON.stringify(form) !== JSON.stringify(content.footer);
  useEffect(() => {
    setDirty(isDirty);
    return () => setDirty(false);
  }, [isDirty, setDirty]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-gray-800">🦶 फुटर सेक्शन</h2>
      <F label="विवरण (फुटर में)" value={form.description} onChange={set('description')} multiline />
      <F label="टैगलाइन (फुटर में)" value={form.tagline} onChange={set('tagline')} />
      <F label="कॉपीराइट टेक्स्ट" value={form.copyright} onChange={set('copyright')} />
      <SaveBtn onClick={save} saving={saving} />
    </div>
  );
}

// ─── Sidebar sections ─────────────────────────────────────────────────────────

const SECTIONS = [
  { id: 'general', label: 'सामान्य सेटिंग्स', icon: '⚙️' },
  { id: 'nav', label: 'नेविगेशन मेनू', icon: '📋' },
  { id: 'whatsapp', label: 'WhatsApp', icon: '💬' },
  { id: 'social', label: 'सोशल मीडिया', icon: '📱' },
  { id: 'contactinfo', label: 'संपर्क जानकारी', icon: '📞' },
  { id: 'hero', label: 'होम — हीरो', icon: '🏠' },
  { id: 'stats', label: 'होम — आंकड़े', icon: '📊' },
  { id: 'mission', label: 'होम — मिशन', icon: '🎯' },
  { id: 'hometimeline', label: 'होम — यात्रा', icon: '📅' },
  { id: 'quotejoin', label: 'होम — उद्धरण/जुड़ें', icon: '💭' },
  { id: 'about', label: 'परिचय पेज', icon: '👤' },
  { id: 'vision', label: 'दृष्टिकोण पेज', icon: '👁️' },
  { id: 'media', label: 'मीडिया पेज', icon: '📸' },
  { id: 'contactpage', label: 'संपर्क पेज', icon: '📩' },
  { id: 'footer', label: 'फुटर', icon: '🦶' },
];

function SectionContent({ section, setDirty }: { section: string; setDirty: (d: boolean) => void }) {
  switch (section) {
    case 'general': return <GeneralSection setDirty={setDirty} />;
    case 'nav': return <NavigationSection setDirty={setDirty} />;
    case 'whatsapp': return <WhatsAppSection setDirty={setDirty} />;
    case 'social': return <SocialSection setDirty={setDirty} />;
    case 'contactinfo': return <ContactInfoSection setDirty={setDirty} />;
    case 'hero': return <HeroSection setDirty={setDirty} />;
    case 'stats': return <StatsSection setDirty={setDirty} />;
    case 'mission': return <MissionSection setDirty={setDirty} />;
    case 'hometimeline': return <HomeTimelineSection setDirty={setDirty} />;
    case 'quotejoin': return <QuoteJoinSection setDirty={setDirty} />;
    case 'about': return <AboutSection setDirty={setDirty} />;
    case 'vision': return <VisionSection setDirty={setDirty} />;
    case 'media': return <MediaSection setDirty={setDirty} />;
    case 'contactpage': return <ContactPageSection setDirty={setDirty} />;
    case 'footer': return <FooterSection setDirty={setDirty} />;
    default: return null;
  }
}

// ─── Main Admin component ─────────────────────────────────────────────────────

const ADMIN_PASS = 'admin@2024';

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin_authed') === '1');
  const [pwd, setPwd] = useState('');
  const [pwdError, setPwdError] = useState(false);
  const [activeSection, setActiveSection] = useState('general');
  const [isDirty, setIsDirty] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { reset } = useSite();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd === ADMIN_PASS) {
      sessionStorage.setItem('admin_authed', '1');
      setAuthed(true);
    } else {
      setPwdError(true);
      setTimeout(() => setPwdError(false), 2000);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 font-sans">
        <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-3xl">🌸</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">एडमिन पैनल</h1>
            <p className="text-gray-500 mt-1 text-sm">आशीष कुमार सिंह — वेबसाइट प्रबंधन</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">पासवर्ड</label>
              <input
                type="password"
                value={pwd}
                onChange={e => setPwd(e.target.value)}
                placeholder="पासवर्ड दर्ज करें"
                className={`w-full border-2 ${pwdError ? 'border-red-400' : 'border-gray-200'} rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 transition-colors text-lg`}
              />
              {pwdError && <p className="text-red-500 text-sm mt-1">गलत पासवर्ड</p>}
            </div>
            <button type="submit" className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-lg shadow-lg shadow-orange-200">
              लॉगिन करें →
            </button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-6">
            <a href="/" className="hover:text-orange-500 transition-colors">← वेबसाइट पर वापस जाएं</a>
          </p>
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 flex flex-col shadow-xl md:shadow-none
        transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-5 border-b bg-gradient-to-r from-orange-500 to-amber-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">🌸</div>
            <div>
              <h2 className="font-bold text-white text-base leading-tight">एडमिन पैनल</h2>
              <p className="text-white/70 text-xs">वेबसाइट सामग्री प्रबंधन</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => {
                if (isDirty) {
                  if (!confirm('आपके पास सहेजे न गए बदलाव हैं। क्या आप उन्हें छोड़ना चाहते हैं?')) {
                    return;
                  }
                }
                setActiveSection(s.id);
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-3 ${
                activeSection === s.id
                  ? 'bg-orange-100 text-orange-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer links */}
        <div className="p-4 border-t space-y-2">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors px-2 py-1">
            <span>🌐</span> लाइव वेबसाइट देखें
          </a>
          <button
            onClick={() => {
              if (confirm('क्या आप सभी बदलाव मूल डिफॉल्ट पर वापस करना चाहते हैं?')) {
                reset();
                toast({ title: "रीसेट सफल", description: "सभी सामग्री डिफॉल्ट पर वापस हो गई।" });
              }
            }}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-600 transition-colors px-2 py-1 w-full text-left">
            <span>↺</span> डिफॉल्ट पर रीसेट करें
          </button>
          <button
            onClick={() => { sessionStorage.removeItem('admin_authed'); setAuthed(false); }}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors px-2 py-1 w-full text-left">
            <span>🚪</span> लॉगआउट
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="bg-white border-b px-6 py-3 flex items-center gap-4 shadow-sm sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <h1 className="font-bold text-gray-800 text-lg">
              {SECTIONS.find(s => s.id === activeSection)?.icon} {SECTIONS.find(s => s.id === activeSection)?.label}
            </h1>
            <p className="text-xs text-gray-400">बदलाव करने के बाद "सहेजें" बटन दबाएं — तुरंत लाइव होगा</p>
          </div>
        </div>

        {/* Section form */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <SectionContent section={activeSection} setDirty={setIsDirty} />
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
