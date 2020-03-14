import React from 'react';

interface Props {
  title: string
}

const Header: React.FunctionComponent<Props> = ({title}) => <h1>{title}</h1>

export default Header;