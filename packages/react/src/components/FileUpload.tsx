import { useRef, useState, type DragEvent, type ChangeEvent } from 'react'

export interface FileUploadProps {
  label?: string
  hint?: string
  accept?: string
  multiple?: boolean
  disabled?: boolean
  onFiles?: (files: File[]) => void
}

export function FileUpload({
  label = 'Upload file',
  hint,
  accept,
  multiple = false,
  disabled = false,
  onFiles,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)
  const [done, setDone] = useState<string | null>(null)

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const arr = Array.from(files)
    setDone(arr.length === 1 ? arr[0].name : `${arr.length} files selected`)
    onFiles?.(arr)
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    handleFiles(e.target.files)
    e.target.value = ''
  }

  function onDragOver(e: DragEvent) {
    e.preventDefault()
    if (!disabled) setDrag(true)
  }

  function onDragLeave(e: DragEvent) {
    if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
      setDrag(false)
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault()
    setDrag(false)
    if (!disabled) handleFiles(e.dataTransfer.files)
  }

  const cls = [
    'file-upload',
    drag ? 'file-upload--drag' : '',
    done ? 'file-upload--done' : '',
    disabled ? 'file-upload--disabled' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      role="button"
      aria-label={done ?? label}
      aria-disabled={disabled}
      className={cls}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => {
        if (!disabled) inputRef.current?.click()
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          if (!disabled) inputRef.current?.click()
        }
      }}
      tabIndex={disabled ? -1 : 0}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={onChange}
        aria-label={label}
        tabIndex={-1}
      />
      <svg className="file-upload__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        {done ? (
          <path
            d="M5 13l4 4L19 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ) : (
          <>
            <path
              d="M12 15V3m0 0L8 7m4-4 4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M3 15v4a2 2 0 002 2h14a2 2 0 002-2v-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </>
        )}
      </svg>
      <div>
        <span className="file-upload__label">{done ?? label}</span>
        {!done && hint && <p className="file-upload__hint">{hint}</p>}
      </div>
    </div>
  )
}
