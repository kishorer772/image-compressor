import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import FileInput from './FileInput';

describe('Image Compressor', () => {
  // test('renders learn react link', () => {
  //   render(<App />);
  //   const linkElement = screen.getByText(/image compressor/i);
  //   expect(linkElement).toBeInTheDocument();
  // });
  test('File Image Upload', () => {
    render(<FileInput disabled={false} />);
    const inputElement = screen.getByTestId('file-input') as HTMLInputElement;
    const nonImageFile = new File(['dummy content'], 'example.txt', {
      type: 'text/plain',
    });
    const imageFile = new File(['dummy content'], 'example.jpg', {
      type: 'image/jpeg',
    });
    expect(inputElement.files?.length).toBe(0);
    const dataTransfer = { files: [nonImageFile] };

    fireEvent.change(inputElement, { target: dataTransfer });

    dataTransfer.files = [imageFile];
    fireEvent.change(inputElement, { target: dataTransfer });

    expect(inputElement.files?.length).toBe(1);
    expect(inputElement.files?.[0]).toBe(imageFile);
  });
  test('File Png file Upload', () => {
    render(<FileInput disabled={false} />);
    const inputElement = screen.getByTestId('file-input') as HTMLInputElement;

    const imageFilePng = new File(['dummy content'], 'example.jpg', {
      type: 'image/png',
    });
    const dataTransfer = { files: [imageFilePng] };

    fireEvent.change(inputElement, { target: dataTransfer });

    expect(inputElement.files?.length).toBe(1);
  });
});
