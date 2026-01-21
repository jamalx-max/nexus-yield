#!/usr/bin/env python3
"""
Shard stacks-llm.txt into numbered markdown files with GitBook cleanup.
Follows existing stacks-shards pattern: NNN_topic_name.md
"""
import os
import re
import shutil

def sanitize_filename(name):
    """Remove invalid characters and replace spaces with underscores."""
    s = re.sub(r'[^\w\s-]', '', name).strip().lower()
    return re.sub(r'[-\s]+', '_', s)

def clean_gitbook_syntax(content):
    """Remove GitBook-specific syntax and convert to standard markdown."""
    # Remove figure/img tags
    content = re.sub(r'<figure>.*?</figure>', '', content, flags=re.DOTALL)
    content = re.sub(r'<div[^>]*>.*?</div>', '', content, flags=re.DOTALL)
    
    # Convert hints to blockquotes
    content = re.sub(r'\{% hint style="info" %\}', '> **NOTE:**', content)
    content = re.sub(r'\{% hint style="warning" %\}', '> **WARNING:**', content)
    content = re.sub(r'\{% hint style="danger" %\}', '> **DANGER:**', content)
    content = re.sub(r'\{% hint style="success" %\}', '> **TIP:**', content)
    content = re.sub(r'\{% endhint %\}', '', content)
    
    # Remove steppers (keep content)
    content = re.sub(r'\{% stepper %\}', '', content)
    content = re.sub(r'\{% endstepper %\}', '', content)
    content = re.sub(r'\{% step %\}', '', content)
    content = re.sub(r'\{% endstep %\}', '', content)
    
    # Remove tabs
    content = re.sub(r'\{% tabs %\}', '', content)
    content = re.sub(r'\{% endtabs %\}', '', content)
    content = re.sub(r'\{% tab title="([^"]*)" %\}', r'**\1:**', content)
    content = re.sub(r'\{% endtab %\}', '', content)
    
    # Remove code titles
    content = re.sub(r'\{% code title="[^"]*"[^%]*%\}', '', content)
    content = re.sub(r'\{% endcode %\}', '', content)
    
    # Remove file includes
    content = re.sub(r'\{% file src="[^"]*" %\}', '', content)
    
    # Clean up HTML entities
    content = content.replace('&#x20;', ' ')
    content = content.replace('&amp;', '&')
    
    # Remove multiple blank lines
    content = re.sub(r'\n{3,}', '\n\n', content)
    
    return content.strip()

def is_valid_header(title):
    """Check if this is a real section header vs a code comment."""
    # Skip lowercase headers (code comments like "# install CLI globally")
    if title.islower():
        return False
    # Skip very long headers (likely not real titles)
    if len(title.split()) > 10:
        return False
    # Skip headers that look like code
    if title.startswith('for ') or title.startswith('npm ') or title.startswith('import '):
        return False
    return True

def shard_document(input_file, output_dir):
    """Parse the input file and create sharded markdown files."""
    # Clear existing directory
    if os.path.exists(output_dir):
        shutil.rmtree(output_dir)
    os.makedirs(output_dir)
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split by top-level headers
    sections = re.split(r'^(# .+)$', content, flags=re.MULTILINE)
    
    file_counter = 0
    created_files = []
    
    i = 1  # Skip first empty element
    while i < len(sections):
        if sections[i].startswith('# '):
            header = sections[i].strip()[2:]  # Remove "# "
            body = sections[i + 1] if i + 1 < len(sections) else ""
            
            # Skip invalid headers
            if not is_valid_header(header):
                i += 2
                continue
            
            file_counter += 1
            filename = f"{file_counter:03d}_{sanitize_filename(header)}.md"
            filepath = os.path.join(output_dir, filename)
            
            # Clean content
            full_content = f"# {header}\n\n{body}"
            cleaned_content = clean_gitbook_syntax(full_content)
            
            # Write file
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(cleaned_content)
            
            created_files.append(filename)
        
        i += 2
    
    # Generate all_shards_list.txt
    list_path = os.path.join(os.path.dirname(output_dir), 'all_shards_list.txt')
    with open(list_path, 'w', encoding='utf-8') as f:
        for filename in created_files:
            f.write(filename + '\n')
    
    print(f"Created {len(created_files)} shards in {output_dir}")
    print(f"Updated {list_path}")
    return created_files

if __name__ == "__main__":
    import sys
    input_file = sys.argv[1] if len(sys.argv) > 1 else 'stacks-llm.txt'
    output_dir = sys.argv[2] if len(sys.argv) > 2 else 'stacks-shards'
    shard_document(input_file, output_dir)
