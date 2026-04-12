import { render, screen } from '@testing-library/react'
import FileUploader from '@/components/FileUploader'

jest.mock('react-dropzone', () => ({
  useDropzone: () => ({
    getRootProps: () => ({}),
    getInputProps: () => ({}),
    isDragActive: false,
  }),
}))

describe('FileUploader', () => {
  it('renders the upload prompt', () => {
    render(<FileUploader onData={jest.fn()} />)
    expect(screen.getByText(/drop.*csv.*excel/i)).toBeInTheDocument()
  })

  it('shows accepted file types', () => {
    render(<FileUploader onData={jest.fn()} />)
    expect(screen.getByText(/\.csv/i)).toBeInTheDocument()
  })
})
