# ReLife Local Diagnostic Agent

Local Windows diagnostic agent that safely samples:
- CPU model, cores, and live utilization
- Memory (total, available, swap)
- Storage volumes and types (SSD/HDD)
- Battery state of charge, design capacity, full charge capacity, cycle count (via Windows battery API / WMI)
- Safe thermal telemetry where exposed by hardware ACPI/WMI sensors

Designed to expose whitelisted endpoints only. Arbitrary commands are strictly forbidden.
