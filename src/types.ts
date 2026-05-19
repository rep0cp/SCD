export interface MappingDetail {
  clause: string;
  text: string;
}

export interface Mapping {
  iso?: MappingDetail;
  soc2?: MappingDetail;
  pci?: MappingDetail;
  gdpr?: MappingDetail;
  dora?: MappingDetail;
  nist?: MappingDetail;
  cis?: MappingDetail;
  cobit?: MappingDetail;
}

export interface SecurityControl {
  id: string;
  label: string;
  description: string;
  category: string;
  keywords?: string[];
  mappings: Mapping;
}

export type ComplianceStandard = 'iso' | 'soc2' | 'pci' | 'gdpr' | 'dora' | 'nist' | 'cis' | 'cobit';

export const STANDARDS: Record<ComplianceStandard, { label: string; description: string; version: string }> = {
  iso: {
    label: 'ISO 27001',
    version: '2022',
    description: 'International standard for information security management.'
  },
  soc2: {
    label: 'SOC 2',
    version: '2017 TSC',
    description: 'Security, Availability, Processing Integrity, Confidentiality, and Privacy.'
  },
  pci: {
    label: 'PCI DSS',
    version: 'v4.0',
    description: 'Requirements for companies that process credit card information.'
  },
  gdpr: {
    label: 'GDPR',
    version: '2016/679',
    description: 'EU General Data Protection Regulation for privacy and data protection.'
  },
  dora: {
    label: 'DORA',
    version: 'EU 2022/2554',
    description: 'Digital Operational Resilience Act for the EU financial sector.'
  },
  nist: {
    label: 'NIST CSF',
    version: 'v2.0',
    description: 'NIST Cybersecurity Framework for improving critical infrastructure cybersecurity.'
  },
  cis: {
    label: 'CIS Controls',
    version: 'v8',
    description: 'Prioritized set of actions to protect organizations and data from cyber attacks.'
  },
  cobit: {
    label: 'COBIT',
    version: '2019',
    description: 'Framework for the governance and management of enterprise information and technology.'
  }
};
