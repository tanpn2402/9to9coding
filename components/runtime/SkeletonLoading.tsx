import React from 'react';

type Props = {
  isLoading: boolean;
  loadingContent: JSX.Element;
  loadedContent: JSX.Element;
};

export const SkeletonLoading: React.FC<Props> = ({ isLoading, loadedContent, loadingContent }) => {
  if (isLoading) return loadingContent;
  return loadedContent;
};
